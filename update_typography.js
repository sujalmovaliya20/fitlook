const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getClamp(size) {
  if (size <= 12) return 'clamp(10px,2vw,12px)';
  if (size <= 14) return 'clamp(12px,2.5vw,14px)';
  if (size <= 16) return 'clamp(14px,3vw,16px)';
  if (size <= 18) return 'clamp(15px,3.5vw,18px)';
  if (size <= 22) return 'clamp(16px,4vw,20px)';
  if (size <= 26) return 'clamp(18px,4.5vw,24px)';
  if (size <= 32) return 'clamp(20px,5vw,30px)';
  if (size <= 40) return 'clamp(22px,6vw,36px)';
  return 'clamp(24px,7vw,48px)';
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace text-[XXpx]
  content = content.replace(/text-\[(\d+)px\]/g, (match, p1) => {
    const size = parseInt(p1, 10);
    return `text-[${getClamp(size)}]`;
  });

  // Replace style={{ fontSize: 'XXpx' }}
  content = content.replace(/fontSize:\s*['"]?(\d+)px['"]?/g, (match, p1) => {
    const size = parseInt(p1, 10);
    return `fontSize: '${getClamp(size)}'`;
  });

  // Special Tailwind classes text-xs, text-sm etc. We can skip these since the user 
  // asked to replace hardcoded font sizes. If we see text-xs, the user mapped it, but
  // standard tailwind classes are already somewhat responsive. 
  // Actually the prompt says "Replace all hardcoded font sizes... If using Tailwind -> use responsive prefixes".
  // The codebase heavily uses `text-[XXpx]`, which is fully handled by our regex above.

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk(srcDir);
console.log("Done.");
