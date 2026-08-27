const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./app/admin');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("variant: 'destructive'")) {
    content = content.replace(/variant: 'destructive'/g, "variant: 'error'");
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
