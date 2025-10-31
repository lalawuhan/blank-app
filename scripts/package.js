const fs = require('fs');
const path = require('path');

const distFolder = path.join(__dirname, '..', 'dist');
const extensionName = 'com.indesign.documentgenerator';

console.log('📦 Packaging InDesign Extension...');
console.log(`📂 Extension folder: ${distFolder}`);
console.log(`🔖 Extension ID: ${extensionName}`);
console.log('\n✅ Build complete!');
console.log('\n📋 Installation Instructions:');
console.log('1. Copy the "dist" folder to your CEP extensions directory:');

const platform = process.platform;
let cepPath = '';

if (platform === 'darwin') {
  cepPath = '~/Library/Application Support/Adobe/CEP/extensions/';
} else if (platform === 'win32') {
  cepPath = '%APPDATA%\\Adobe\\CEP\\extensions\\';
} else {
  cepPath = 'Your CEP extensions folder';
}

console.log(`   ${cepPath}${extensionName}`);
console.log('\n2. Restart InDesign');
console.log('3. Go to Window > Extensions > Document Generator');
console.log('\n💡 For development, you may need to enable debug mode:');
console.log('   https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md#debugging-unsigned-extensions');
