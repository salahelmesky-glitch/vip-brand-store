/**
 * Generate PWA app icons from VIP Brand logo
 * Creates PNG icons at different sizes for PWA manifest
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconsDir = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate a simple VIP branded SVG icon for each size
function generateIconSVG(size) {
  const padding = Math.round(size * 0.12);
  const innerSize = size - padding * 2;
  const cornerRadius = Math.round(size * 0.18);
  const fontSize = Math.round(size * 0.28);
  const subtitleSize = Math.round(size * 0.08);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c0020"/>
      <stop offset="50%" stop-color="#050010"/>
      <stop offset="100%" stop-color="#0c0020"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#bf40bf"/>
      <stop offset="50%" stop-color="#7b2fff"/>
      <stop offset="100%" stop-color="#bf40bf"/>
    </linearGradient>
    <linearGradient id="text" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#e0c0e0"/>
      <stop offset="70%" stop-color="#bf40bf"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="${size * 0.02}" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="url(#bg)"/>
  <rect x="${padding * 0.6}" y="${padding * 0.6}" width="${size - padding * 1.2}" height="${size - padding * 1.2}" rx="${cornerRadius * 0.8}" fill="none" stroke="url(#accent)" stroke-width="${size * 0.008}" opacity="0.3"/>
  <circle cx="${size / 2}" cy="${size * 0.38}" r="${size * 0.15}" fill="url(#accent)" opacity="0.08"/>
  <text x="${size / 2}" y="${size * 0.48}" text-anchor="middle" font-family="'Arial Black', 'Helvetica', sans-serif" font-weight="900" font-size="${fontSize}" fill="url(#text)" filter="url(#glow)" letter-spacing="${size * 0.02}">VIP</text>
  <text x="${size / 2}" y="${size * 0.65}" text-anchor="middle" font-family="'Arial', sans-serif" font-weight="600" font-size="${subtitleSize}" fill="#bf40bf" letter-spacing="${size * 0.015}" opacity="0.8">BRAND</text>
  <line x1="${size * 0.3}" y1="${size * 0.72}" x2="${size * 0.7}" y2="${size * 0.72}" stroke="url(#accent)" stroke-width="${size * 0.005}" opacity="0.3"/>
  <text x="${size / 2}" y="${size * 0.82}" text-anchor="middle" font-family="'Arial', sans-serif" font-weight="400" font-size="${Math.max(subtitleSize * 0.7, 5)}" fill="#99999f" opacity="0.6">⚡ LUXURY STREETWEAR</text>
</svg>`;
}

// Write icons
sizes.forEach(size => {
  const svg = generateIconSVG(size);
  const filePath = path.join(iconsDir, `icon-${size}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`✅ Generated icon-${size}.svg`);
});

// Also create the main app icon SVG
const mainIcon = generateIconSVG(512);
fs.writeFileSync(path.join(iconsDir, 'app-icon.svg'), mainIcon);
console.log(`✅ Generated app-icon.svg`);

console.log('\n🎉 All PWA icons generated!\n');
console.log('Note: For production, convert these SVGs to PNGs using a tool like:');
console.log('  npx sharp-cli icon-512.svg -o icon-512.png --resize 512 512');
