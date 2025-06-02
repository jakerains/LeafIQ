#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Finding your organization ID...\n');

// Check if there's a user logged in via simple auth
const authStorePath = path.join(__dirname, '..', 'src', 'stores', 'simpleAuthStore.ts');

if (fs.existsSync(authStorePath)) {
  const authStoreContent = fs.readFileSync(authStorePath, 'utf-8');
  
  // Look for any hardcoded organization IDs or demo data
  const orgIdMatches = authStoreContent.match(/organizationId.*?['"`]([^'"`]+)['"`]/gi);
  
  if (orgIdMatches) {
    console.log('📍 Found organization IDs in auth store:');
    orgIdMatches.forEach(match => {
      console.log(`   ${match}`);
    });
    console.log('');
  }
}

console.log('💡 To find your organization ID:');
console.log('   1. Log into your LeafIQ admin panel');
console.log('   2. Open browser developer tools (F12)');
console.log('   3. Go to Console tab');
console.log('   4. Type: localStorage.getItem("leafiq_auth")');
console.log('   5. Look for "organizationId" in the response');
console.log('');
console.log('🔧 Once you have your org ID, update it in:');
console.log('   scripts/convert-truenorth-to-json.js');
console.log('   Change: ORGANIZATION_ID = "demo-org-id"');
console.log('   To:     ORGANIZATION_ID = "your-actual-org-id"');
console.log('');
console.log('📝 Alternative: Use demo-org-id for testing purposes'); 