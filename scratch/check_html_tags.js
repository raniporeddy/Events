const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'data' && file !== 'brain' && file !== 'scratch') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles('.');
console.log('Total HTML files found:', htmlFiles.length);

const missingConfig = [];
const filesWithExtraQuote = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hasExtraQuote = content.includes('crossorigin="anonymous""');
  const hasConfig = content.includes('config.js');
  const hasStyles = content.includes('styles.css');
  const relPath = path.relative('.', file);
  
  if (hasExtraQuote) filesWithExtraQuote.push(relPath);
  if (!hasConfig) missingConfig.push(relPath);

  console.log(relPath.padEnd(35), '| extraQuote:', hasExtraQuote, '| config.js:', hasConfig, '| styles.css:', hasStyles);
});

console.log('\nFiles with extra quote in FontAwesome:', filesWithExtraQuote);
console.log('Files missing config.js:', missingConfig);
