const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe, minimal API to the renderer (ThinkDashboard.html)
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  getVersion: () => ipcRenderer.invoke('get-app-version'),

  // Open links externally (Firebase auth redirects, etc.)
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Detect we're running inside Electron (useful for UI tweaks)
  isElectron: true,

  // Quick Capture IPC triggers
  addQuickCaptureIdea: (text) => ipcRenderer.send('add-quick-capture-idea', text),
  closeQuickCapture: () => ipcRenderer.send('close-quick-capture'),
  onAddQuickCaptureIdea: (callback) => {
    // Wrap to prevent leaks and handle standard events
    ipcRenderer.on('add-quick-capture-idea', (_event, text) => callback(text));
  },
  updateTrayIcon: (pngData) => ipcRenderer.send('update-tray-icon', pngData),
  setThemeColor: (color) => ipcRenderer.send('set-theme-color', color)
});
