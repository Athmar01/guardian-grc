const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to update imports in a file
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Replace Clerk imports with our mock auth imports
  const replacements = [
    {
      from: /import\s*{\s*auth(?:,\s*[^}]+)?\s*}\s*from\s*['"]@clerk\/nextjs\/server['"]/g,
      to: "import { auth } from '@/lib/api-auth'"
    },
    {
      from: /import\s*{\s*currentUser(?:,\s*[^}]+)?\s*}\s*from\s*['"]@clerk\/nextjs\/server['"]/g,
      to: "import { currentUser } from '@/lib/api-auth'"
    },
    {
      from: /import\s*{\s*auth\s*,\s*currentUser(?:,\s*[^}]+)?\s*}\s*from\s*['"]@clerk\/nextjs\/server['"]/g,
      to: "import { auth, currentUser } from '@/lib/api-auth'"
    },
    {
      from: /import\s*{\s*auth\s*,\s*clerkClient\s*,\s*EmailAddress\s*}\s*from\s*['"]@clerk\/nextjs\/server['"]/g,
      to: "import { auth, clerkClient, EmailAddress } from '@/lib/api-auth'"
    },
    {
      from: /import\s*{\s*auth\s*,\s*clerkClient\s*,\s*User\s*}\s*from\s*['"]@clerk\/nextjs\/server['"]/g,
      to: "import { auth, clerkClient, User } from '@/lib/api-auth'"
    },
    {
      from: /import\s*{\s*getAuth\s*}\s*from\s*['"]@clerk\/nextjs\/server['"]/g,
      to: "import { getAuth } from '@/lib/api-auth'"
    },
    {
      from: /import\s*{\s*useUser\s*}\s*from\s*['"]@clerk\/nextjs['"]/g,
      to: "import { useUser } from '@/lib/auth'"
    },
    {
      from: /import\s*{\s*useAuth\s*}\s*from\s*['"]@clerk\/nextjs['"]/g,
      to: "import { useAuth } from '@/lib/auth'"
    }
  ];
  
  replacements.forEach(({ from, to }) => {
    if (content.match(from)) {
      content = content.replace(from, to);
      modified = true;
    }
  });
  
  // Also update any await clerkClient() calls to just clerkClient()
  if (content.includes('await clerkClient()')) {
    content = content.replace(/await\s+clerkClient\(\)/g, 'clerkClient()');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

// Main execution
const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
const componentsDir = path.join(__dirname, '..', 'src', 'components');
const appDir = path.join(__dirname, '..', 'src', 'app');

console.log('Updating auth imports...\n');

// Find and update all TypeScript files in the API directory
const apiFiles = findTsFiles(apiDir);
apiFiles.forEach(updateImports);

// Find and update all TypeScript files in the components directory
const componentFiles = findTsFiles(componentsDir);
componentFiles.forEach(updateImports);

// Find and update all TypeScript files in the app directory (excluding api)
const appFiles = findTsFiles(appDir).filter(f => !f.includes('/api/'));
appFiles.forEach(updateImports);

console.log('\nAuth import updates complete!');
