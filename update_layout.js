const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Widths
  { regex: /w-\[800px\]/g, to: 'w-full max-w-[800px]' },
  { regex: /w-\[600px\]/g, to: 'w-full max-w-[600px]' },
  { regex: /w-\[540px\]/g, to: 'w-full max-w-[540px]' },
  { regex: /w-\[400px\]/g, to: 'w-full max-w-[400px]' },
  { regex: /w-\[360px\]/g, to: 'w-full max-w-[360px]' },
  { regex: /w-\[320px\]/g, to: 'w-full max-w-[320px]' },
  { regex: /w-\[300px\]/g, to: 'w-full max-w-[300px]' },
  { regex: /w-1\/2/g, to: 'w-full md:w-1/2' }, // For ReviewStep where it is w-full md:w-1/2 already or w-1/2

  // Spacing (padding/margin)
  { regex: /p-8/g, to: 'p-4 md:p-6 lg:p-8' },
  { regex: /px-16/g, to: 'px-4 md:px-8 lg:px-16' },
  { regex: /px-12/g, to: 'px-4 md:px-8 lg:px-12' },
  { regex: /px-10/g, to: 'px-4 lg:px-10' },
  { regex: /px-8/g, to: 'px-4 lg:px-8' },
  { regex: /my-20/g, to: 'my-8 md:my-12 lg:my-20' },
  { regex: /my-16/g, to: 'my-8 lg:my-16' },
  { regex: /mb-24/g, to: 'mb-12 md:mb-24' },
  { regex: /pb-24/g, to: 'pb-12 md:pb-24' },
  { regex: /py-10/g, to: 'py-6 md:py-10' },
  { regex: /py-8/g, to: 'py-4 md:py-8' },
  { regex: /mt-20/g, to: 'mt-10 md:mt-20' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  replacements.forEach(({ regex, to }) => {
    content = content.replace(regex, to);
  });

  // Next.js Image fixes
  if (content.includes('<Image') && !content.includes('sizes=')) {
    // Basic catch-all for Next.js image if sizes is missing
    content = content.replace(/<Image\s/g, '<Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" ');
  }

  // <img fixes
  content = content.replace(/<img\s(.*?)className="([^"]*)"/g, (match, p1, p2) => {
    if (!p2.includes('max-w-full')) {
      return `<img ${p1}className="${p2} max-w-full h-auto"`;
    }
    return match;
  });

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
