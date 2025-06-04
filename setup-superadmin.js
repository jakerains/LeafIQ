#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input with a default value
function prompt(question, defaultValue) {
  return new Promise((resolve) => {
    rl.question(`${question} (${defaultValue}): `, (input) => {
      resolve(input.trim() || defaultValue);
    });
  });
}

async function setupSuperAdmin() {
  console.log('🔧 LeafIQ Super Admin Setup Wizard');
  console.log('==================================');
  console.log('This script will help you set up your environment variables and create a super admin account.\n');

  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  let envFileExists = fs.existsSync(envPath);
  let envContents = '';

  if (envFileExists) {
    console.log('✅ .env file found');
    envContents = fs.readFileSync(envPath, 'utf8');
  } else {
    console.log('❌ No .env file found. We will create one.');
  }

  // Get values from user or use defaults
  console.log('\n📝 Please provide the following information:');
  
  const supabaseUrl = await prompt('Supabase URL', process.env.VITE_SUPABASE_URL || 'https://xaddlctkbrdeigeqfswd.supabase.co');
  const supabaseServiceKey = await prompt('Supabase Service Role Key (keep secure)', process.env.SUPABASE_SERVICE_ROLE_KEY || '');
  
  // Email and password for super admin
  console.log('\n👤 Super Admin Account Details:');
  const email = await prompt('Email', 'jakerains@gmail.com');
  const password = await prompt('Password', 'DexDunk16710!');
  const demoOrgId = await prompt('Demo Organization ID', 'd85af8c9-0d4a-451c-bc25-8c669c71142e');

  // Update or create .env file
  let updatedEnv = envContents;
  
  // Update VITE_SUPABASE_URL
  if (updatedEnv.includes('VITE_SUPABASE_URL=')) {
    updatedEnv = updatedEnv.replace(/VITE_SUPABASE_URL=.*\n/, `VITE_SUPABASE_URL=${supabaseUrl}\n`);
  } else {
    updatedEnv += `\nVITE_SUPABASE_URL=${supabaseUrl}`;
  }
  
  // Update SUPABASE_SERVICE_ROLE_KEY
  if (updatedEnv.includes('SUPABASE_SERVICE_ROLE_KEY=')) {
    updatedEnv = updatedEnv.replace(/SUPABASE_SERVICE_ROLE_KEY=.*\n/, `SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}\n`);
  } else {
    updatedEnv += `\nSUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}`;
  }
  
  // Ensure newline at end of file
  if (!updatedEnv.endsWith('\n')) {
    updatedEnv += '\n';
  }
  
  // Write the updated .env file
  fs.writeFileSync(envPath, updatedEnv);
  console.log('\n✅ .env file updated with Supabase credentials');

  // Update the create-superadmin.js file with the provided values
  const createSuperadminPath = path.join(process.cwd(), 'create-superadmin.js');
  let superadminScript = fs.readFileSync(createSuperadminPath, 'utf8');
  
  // Update email in script
  superadminScript = superadminScript.replace(/const email = '[^']+';/, `const email = '${email}';`);
  
  // Update password in script
  superadminScript = superadminScript.replace(/const password = '[^']+';/, `const password = '${password}';`);
  
  // Update demo org ID in script
  superadminScript = superadminScript.replace(/const demoOrgId = '[^']+';/, `const demoOrgId = '${demoOrgId}';`);
  
  // Write the updated script
  fs.writeFileSync(createSuperadminPath, superadminScript);
  console.log('✅ create-superadmin.js updated with account details');

  // Run the create-superadmin.js script
  console.log('\n🚀 Running create-superadmin.js...');
  try {
    execSync('node create-superadmin.js', { stdio: 'inherit' });
    console.log('\n🎉 Super admin setup completed successfully!');
  } catch (error) {
    console.error('\n❌ Error running create-superadmin.js:', error.message);
    console.log('\nTry running the script manually with:');
    console.log('node create-superadmin.js');
  }

  rl.close();
}

setupSuperAdmin().catch(error => {
  console.error('Error during setup:', error);
  rl.close();
});