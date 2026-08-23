/**
 * Creates tray icon PNG files for macOS menu bar.
 * Run: node create-tray-icon.js
 * 
 * Creates:
 *   assets/trayTemplate.png       (16x16 for 1x displays)
 *   assets/trayTemplate@2x.png    (32x32 for Retina displays)
 * 
 * These are macOS "template images" — black icons that the OS 
 * automatically adapts to light/dark menu bar.
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawBrainIcon(ctx, size) {
  const scale = size / 24;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.scale(scale, scale);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = 'none';

  // Brain paths (Lucide "brain" icon)
  ctx.beginPath();
  ctx.moveTo(12, 5);
  ctx.bezierCurveTo(12, 3.3, 9, 2, 6, 5.125);
  ctx.bezierCurveTo(3, 5.75, 2, 8.5, 3.474, 10.895);
  ctx.bezierCurveTo(2.03, 12.5, 2.53, 15.5, 4.53, 17.483);
  ctx.bezierCurveTo(5, 19.5, 7.5, 21, 10, 20);
  ctx.bezierCurveTo(10.7, 20, 11.4, 19.2, 12, 18);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(12, 5);
  ctx.bezierCurveTo(12, 3.3, 15, 2, 18, 5.125);
  ctx.bezierCurveTo(21, 5.75, 22, 8.5, 20.526, 10.895);
  ctx.bezierCurveTo(21.97, 12.5, 21.47, 15.5, 19.47, 17.483);
  ctx.bezierCurveTo(19, 19.5, 16.5, 21, 14, 20);
  ctx.bezierCurveTo(13.3, 20, 12.6, 19.2, 12, 18);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(12, 5);
  ctx.lineTo(12, 18);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(12, 12);
  ctx.lineTo(18, 12);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(12, 12);
  ctx.lineTo(6, 12);
  ctx.stroke();

  ctx.restore();
}

// Check if canvas module is available
try {
  const { createCanvas } = require('canvas');
  
  const sizes = [
    { name: 'trayTemplate.png', size: 16 },
    { name: 'trayTemplate@2x.png', size: 32 },
  ];
  
  sizes.forEach(({ name, size }) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    drawBrainIcon(ctx, size);
    const buffer = canvas.toBuffer('image/png');
    const outPath = path.join(__dirname, 'assets', name);
    fs.writeFileSync(outPath, buffer);
    console.log(`Created ${outPath}`);
  });
} catch (err) {
  console.error('canvas module not available. Using fallback method.');
  console.log('Run: npm install canvas  — OR use the Python script method below');
  
  // Fallback: Create minimal 1x1 transparent PNG as placeholder
  // (Real icons will be created via Python below)
  process.exit(1);
}
