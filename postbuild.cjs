const fs = require('fs');
const path = require('path');

function copyFileSync(source, target) {
  let targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.copyFileSync(source, targetFile);
}

function copyFolderRecursiveSync(source, target) {
  let files = [];

  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

// 1. Ensure dist/ exists
const distDir = path.resolve(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 2. Copy root static files
const staticFiles = [
  'script.js',
  'styles.css',
  'blog-posts.js',
  'Jyotirmoy_Laha_Resume.pdf'
];

staticFiles.forEach(file => {
  const srcPath = path.resolve(__dirname, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, file));
    console.log(`Copied ${file} -> dist/${file}`);
  }
});

// 3. Copy folders
const folders = [
  { src: 'images', dest: distDir },
  { src: 'portfolio-chatbot/frontend', dest: path.join(distDir, 'portfolio-chatbot') }
];

folders.forEach(folder => {
  const srcPath = path.resolve(__dirname, folder.src);
  if (fs.existsSync(srcPath)) {
    // Ensure destination parent folder exists
    const destParent = folder.dest;
    if (!fs.existsSync(destParent)) {
      fs.mkdirSync(destParent, { recursive: true });
    }
    copyFolderRecursiveSync(srcPath, destParent);
    console.log(`Copied folder ${folder.src} -> ${folder.dest}`);
  }
});

console.log('Post-build static assets copying completed successfully!');
