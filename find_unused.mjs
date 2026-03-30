import fs from 'fs';
import path from 'path';

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}

const publicDir = './public';
const srcDir = './src';

const allImages = getFiles(publicDir).filter(f => f.match(/\.(png|jpe?g|webp|svg|mp4)$/i));
const srcFiles = getFiles(srcDir).filter(f => f.match(/\.(js|jsx|ts|tsx|scss|css)$/i));

// Gather all text from src files
let allCode = '';
for (const src of srcFiles) {
  allCode += fs.readFileSync(src, 'utf8') + '\n';
}

console.log('--- Unused Media Assets in Public ---');
const exceptions = ['android-chrome', 'favicon', 'apple-touch', 'mstile', 'browserconfig', 'og.png', 'safari-pinned'];
for (const img of allImages) {
  const base = path.basename(img);
  let relative = img.replace('./public', ''); 
  // Normalize slashes
  relative = relative.replace(/\\/g, '/');

  if (!allCode.includes(relative) && !allCode.includes(base)) {
    const isException = exceptions.some(e => relative.includes(e));
    if (!isException) {
      console.log(relative);
    }
  }
}
