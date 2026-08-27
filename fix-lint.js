const fs = require('fs');
const path = require('path');

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkSync(filepath, callback);
    } else {
      callback(filepath);
    }
  }
}

walkSync(path.join(__dirname, 'app'), (filepath) => {
  if (!filepath.endsWith('.ts') && !filepath.endsWith('.tsx')) return;

  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;

  // 1. Fix unexpected any in catch blocks
  if (content.includes('catch (error: any)')) {
    content = content.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
    changed = true;
  }

  // 2. Fix unused req in API routes
  if (filepath.includes('\\api\\') && content.includes('req: Request')) {
    // Some routes might use req, some might not.
    // If it's unused, let's prefix with _
    // Let's just prefix all req: Request with _req: Request if req is not used inside
    // Wait, regex might be brittle.
  }

  if (changed) {
    fs.writeFileSync(filepath, content, 'utf8');
  }
});
