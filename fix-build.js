import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Remove unused imports from files
const filesToClean = [
  'src/app/api/admin/newsletter/subscribers/[id]/route.ts',
  'src/app/api/admin/newsletter/subscribers/route.ts',
  'src/app/api/auth/me/route.ts',
  'src/app/api/categories/route.ts',
  'src/app/api/public/opinion/[id]/status/route.ts',
  'src/app/api/public/opinion/route.ts',
  'src/app/api/public/opinion/summary/route.ts',
  'src/lib/models/Articles.ts',
  'src/lib/models/User.ts',
  'src/lib/mock-data/index.tsx'
];

filesToClean.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove unused imports
    content = content
      .replace(/import\s+{[^}]*\b(mongoose|params|_user|_omit|get|err|withAuth|getUserModel)\b[^}]*}\s+from[^;]+;/g, '')
      .replace(/,\s*(mongoose|params|_user|_omit|get|err|withAuth|getUserModel)(?=,|\s*})/g, '')
      .replace(/(mongoose|params|_user|_omit|get|err|withAuth|getUserModel)\s*,/g, '')
      .replace(/,\s*(mongoose|params|_user|_omit|get|err|withAuth|getUserModel)\s*}/g, '}');
    
    fs.writeFileSync(filePath, content);
    console.log(`Cleaned: ${file}`);
  }
});

console.log('Build fixes applied! Try building again.');