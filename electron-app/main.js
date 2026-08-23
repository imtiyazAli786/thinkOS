const { app, BrowserWindow, Menu, shell, nativeTheme, ipcMain, dialog, Tray, globalShortcut, nativeImage } = require('electron');
const path = require('path');
const os = require('os');
const http = require('http');
const fs = require('fs');

// ─── Dev mode ────────────────────────────────────────────────────────────────
const isDev = process.argv.includes('--dev');

// ─── Keep window reference alive ─────────────────────────────────────────────
let mainWindow = null;
let localServer = null;
let serverPort = 0;
let tray = null;
let quickCaptureWindow = null;

// Only truly quit when the user explicitly clicks "Quit" in the tray menu.
// Cmd+Q and the red × button both hide the window instead of quitting.
app.explicitQuit = false;

app.on('before-quit', (e) => {
  if (!app.explicitQuit) {
    // Intercept the quit — hide the window instead
    e.preventDefault();
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.hide();
  }
});

// ─── Start local server to bypass file:// restrictions ─────────────────────
function startLocalServer() {
  return new Promise((resolve) => {
    localServer = http.createServer((req, res) => {
      // Check for quick-capture route
      if (req.url === '/quick-capture') {
        const qcPath = path.join(__dirname, 'quick-capture.html');
        fs.readFile(qcPath, (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading Quick Capture');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        });
        return;
      }

      // Check if requested file exists locally (for js, css, png, etc.)
      const cleanUrl = req.url.split('?')[0];
      const filePath = path.join(__dirname, cleanUrl === '/' || cleanUrl === '/app' ? 'ThinkDashboard.html' : cleanUrl);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        let contentType = 'text/plain';
        if (ext === '.html') contentType = 'text/html';
        else if (ext === '.js') contentType = 'application/javascript';
        else if (ext === '.css') contentType = 'text/css';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.svg') contentType = 'image/svg+xml';
        
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading asset');
          } else {
            res.writeHead(200, { 
              'Content-Type': contentType,
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            });
            res.end(data);
          }
        });
        return;
      }

      // Always serve ThinkDashboard.html regardless of path to handle "client-side routing"
      const htmlPath = path.join(__dirname, 'ThinkDashboard.html');
      fs.readFile(htmlPath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading dashboard');
          return;
        }
        res.writeHead(200, { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(data);
      });
    });

    localServer.listen(0, '127.0.0.1', () => {
      serverPort = localServer.address().port;
      console.log(`Local server running at http://localhost:${serverPort}`);
      resolve();
    });
  });
}

// ─── App lifecycle ───────────────────────────────────────────────────────────
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (app.isReady() && (!mainWindow || mainWindow.isDestroyed())) {
    createWindow();
  } else if (mainWindow) {
    mainWindow.show();
  }
});

app.whenReady().then(async () => {
  await startLocalServer();
  createWindow();
  buildMenu();
  createTrayFromStaticIcon(); // ← Create tray immediately with static PNG
  createQuickCaptureWindow();
  registerGlobalShortcuts();
  enableAutoLaunch();
});

// ─── Create main window ──────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    vibrancy: 'under-window',
    visualEffectState: 'active',
    backgroundColor: '#FAFAF8',
    show: false,
    icon: path.join(__dirname, 'assets', 'icon.icns'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
      partition: 'persist:thinkingzone',
    },
  });

  // Load from localhost instead of file:// to enable Firebase Auth
  mainWindow.loadURL(`http://localhost:${serverPort}/app`);

  const loginSettings = app.getLoginItemSettings();
  const openedAsHidden = loginSettings.wasOpenedAsHidden || false;

  mainWindow.once('ready-to-show', () => {
    if (!openedAsHidden) {
      mainWindow.show();
      if (process.platform === 'darwin') mainWindow.maximize();
    } else {
      console.log('App auto-launched as hidden at login. Keeping window in background.');
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('accounts.google.com') || url.includes('firebaseapp.com') || url.includes('focused-dashboard-f0639.web.app')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.on('close', (e) => {
    // On macOS, always hide instead of close unless explicitly quitting via tray
    if (process.platform === 'darwin' && !app.explicitQuit) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── Native menu bar ─────────────────────────────────────────────────────────
function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about', label: `About Thinking Zone` },
        { type: 'separator' },
        {
          label: 'Preferences…',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow?.webContents.executeJavaScript(`document.querySelector('[data-action="open-settings"]')?.click()`);
          }
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        {
          label: 'Quit Thinking Zone',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.explicitQuit = true;
            app.quit();
          }
        },
      ],
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Note',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.executeJavaScript(`document.querySelector('[data-action="new-block"], #addBlockBtn, .add-block-btn')?.click()`);
          },
        },
        { type: 'separator' },
        {
          label: 'Export as HTML…',
          accelerator: 'CmdOrCtrl+E',
          click: async () => {
            const { filePath } = await dialog.showSaveDialog(mainWindow, {
              title: 'Export Dashboard',
              defaultPath: path.join(os.homedir(), 'Desktop', 'ThinkingZone-Export.html'),
              filters: [{ name: 'HTML File', extensions: ['html'] }],
            });
            if (filePath) {
              fs.copyFileSync(path.join(__dirname, 'ThinkDashboard.html'), filePath);
              shell.showItemInFinder(filePath);
            }
          },
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Find…',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            mainWindow?.webContents.executeJavaScript(`document.querySelector('#thinkSearch, [data-action="search"]')?.focus()`);
          },
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        ...(isDev ? [{ role: 'toggleDevTools' }] : []),
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }] : [{ role: 'close' }]),
      ],
    },
    {
      role: 'help',
      submenu: [
        { label: 'Open in Browser', click: () => shell.openExternal('https://focused-dashboard-f0639.web.app/thinking') },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ─── IPC handlers ────────────────────────────────────────────────────────────
ipcMain.handle('get-platform', () => process.platform);
ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('open-external', (_event, url) => shell.openExternal(url));

ipcMain.on('set-theme-color', (event, color) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setBackgroundColor(color);
  }
});

// Quick Capture IPC routes
ipcMain.on('add-quick-capture-idea', (event, text) => {
  if (mainWindow) {
    mainWindow.webContents.send('add-quick-capture-idea', text);
  }
  if (quickCaptureWindow) {
    quickCaptureWindow.hide();
  }
});

ipcMain.on('close-quick-capture', () => {
  if (quickCaptureWindow) {
    quickCaptureWindow.hide();
  }
});

ipcMain.on('update-tray-icon', (event, pngData) => {
  try {
    const base64Data = pngData.replace(/^data:image\/png;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, 'base64');
    
    // Scale factor 2.0 matches standard Retina @2x displays perfectly
    const iconImage = nativeImage.createFromBuffer(imgBuffer, {
      scaleFactor: 2.0
    });
    
    // Set template flag so macOS handles light/dark menu bar coloring automatically
    iconImage.setTemplateImage(true);
    
    if (tray) {
      tray.setImage(iconImage);
    } else {
      createTray(iconImage);
    }
  } catch (e) {
    console.error('Failed to dynamically update tray icon:', e);
  }
});

// ─── Tray & Quick Capture Helpers ────────────────────────────────────────────

/**
 * Create the tray icon immediately at startup using a static PNG template.
 * This ensures the tray always appears in the macOS menu bar, even before
 * the renderer has loaded and sent a dynamic icon.
 */
function createTrayFromStaticIcon() {
  try {
    // Try to use the pre-generated template PNG from assets.
    // macOS requires a PNG named *Template.png — the OS auto-adapts it
    // to the menu bar appearance (light/dark mode).
    const trayIconPath = path.join(__dirname, 'assets', 'trayTemplate.png');
    let iconImage;
    if (require('fs').existsSync(trayIconPath)) {
      iconImage = nativeImage.createFromPath(trayIconPath);
      // Mark it as a template image so macOS handles light/dark automatically
      iconImage.setTemplateImage(true);
    } else {
      // Absolute fallback: a minimal 16×16 transparent PNG
      iconImage = nativeImage.createEmpty();
    }
    createTray(iconImage);
  } catch (e) {
    console.error('Failed to create tray from static icon:', e);
  }
}

function createTray(iconImage) {
  try {
    if (tray) {
      // Tray already exists — just update its icon
      tray.setImage(iconImage);
      return;
    }
    tray = new Tray(iconImage);
    tray.setToolTip('Thinking Zone — Click to capture ideas');

    // Left-click: toggle Quick Capture popup
    tray.on('click', () => {
      toggleQuickCaptureWindow();
    });

    // Right-click: show context menu
    tray.on('right-click', () => {
      buildTrayContextMenu();
    });

    console.log('Tray icon created successfully.');
  } catch (e) {
    console.error('Failed to create tray natively:', e);
  }
}

function buildTrayContextMenu() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Thinking Zone',
      click: () => {
        if (!mainWindow || mainWindow.isDestroyed()) {
          createWindow();
        } else {
          mainWindow.show();
          mainWindow.focus();
          if (process.platform === 'darwin') app.dock.show();
        }
      }
    },
    {
      label: 'Quick Capture',
      accelerator: 'Ctrl+Space',
      click: () => toggleQuickCaptureWindow()
    },
    { type: 'separator' },
    {
      label: 'Quit Thinking Zone',
      click: () => {
        app.explicitQuit = true;
        app.quit();
      }
    }
  ]);
  tray.popUpContextMenu(contextMenu);
}

function createQuickCaptureWindow() {
  quickCaptureWindow = new BrowserWindow({
    width: 380,
    height: 94,
    show: false,
    frame: false, // Frameless design
    resizable: false,
    transparent: true, // Frosted blur glassmorphism effect
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  quickCaptureWindow.loadURL(`http://localhost:${serverPort}/quick-capture`);

  // Hide the window when it loses focus (blur)
  quickCaptureWindow.on('blur', () => {
    quickCaptureWindow.hide();
  });
}

function toggleQuickCaptureWindow() {
  if (!quickCaptureWindow) {
    createQuickCaptureWindow();
  }

  if (quickCaptureWindow.isVisible()) {
    quickCaptureWindow.hide();
  } else {
    positionQuickCaptureWindow();
    quickCaptureWindow.show();
    quickCaptureWindow.focus();
  }
}

function positionQuickCaptureWindow() {
  if (!tray || !quickCaptureWindow) return;
  const trayBounds = tray.getBounds();
  const windowBounds = quickCaptureWindow.getBounds();
  
  // Center window horizontally under the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
  // Y position: 4px below the status bar icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);
  
  quickCaptureWindow.setPosition(x, y, false);
}

function registerGlobalShortcuts() {
  // Control + Space global capture hotkey
  globalShortcut.register('Control+Space', () => {
    toggleQuickCaptureWindow();
  });
}

// Clean up shortcuts when exiting
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

function enableAutoLaunch() {
  // Only set login items if packaged (i.e. running from /Applications rather than npm run dev)
  if (app.isPackaged) {
    try {
      app.setLoginItemSettings({
        openAtLogin: true,
        openAsHidden: true, // Launch in background tray silently
      });
      console.log('Natively configured auto-launch at macOS login as background tray app.');
    } catch (e) {
      console.error('Failed to configure login item settings:', e);
    }
  }
}
