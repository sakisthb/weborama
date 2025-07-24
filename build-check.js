#!/usr/bin/env node

// Build Verification Script for Netlify
const fs = require('fs');
const path = require('path');

console.log('🔍 Build Verification Started...');

const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

// Check if dist exists
if (!fs.existsSync(distPath)) {
  console.error('❌ dist directory not found!');
  process.exit(1);  
}

// Check critical files
const criticalFiles = [
  'index.html',
  'manifest.json',
  'test.html'
];

console.log('📁 Checking critical files in dist:');
criticalFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} found`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check assets directory
const assetsPath = path.join(distPath, 'assets');
if (fs.existsSync(assetsPath)) {
  const assets = fs.readdirSync(assetsPath);
  console.log(`📦 Assets found: ${assets.length} files`);
  
  const jsFiles = assets.filter(f => f.endsWith('.js'));
  const cssFiles = assets.filter(f => f.endsWith('.css'));
  
  console.log(`   - JavaScript files: ${jsFiles.length}`);
  console.log(`   - CSS files: ${cssFiles.length}`);
  
  if (jsFiles.length === 0) {
    console.error('❌ No JavaScript files found in assets!');
  }
  if (cssFiles.length === 0) {
    console.error('❌ No CSS files found in assets!');  
  }
} else {
  console.error('❌ Assets directory not found!');
}

console.log('✅ Build verification completed');