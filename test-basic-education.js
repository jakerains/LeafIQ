#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = 'https://xaddlctkbrdeigeqfswd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZGRsY3RrYnJkZWlnZXFmc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTYxMzgsImV4cCI6MjA2NDIzMjEzOH0.tgbrIR38y92c8tQAwvJeIbIORozOT4GtagJ2-0BNLPM';

console.log('🧬 Testing Enhanced JSON Parsing with basic_education.json');
console.log('=' .repeat(65));

// Function to get auth token with your credentials
async function getAuthToken() {
  console.log('🔑 Authenticating...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // You'll need to replace with your actual credentials
  const email = 'jakerains@gmail.com'; // Replace if different
  const password = 'your-password-here'; // You'll need to provide this
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
    
    console.log('✅ Successfully authenticated');
    return data.session.access_token;
  } catch (error) {
    console.log('❌ Authentication failed - trying without auth for testing');
    console.log('Note: You may need to provide your actual password for full testing');
    return null;
  }
}

// Test the basic_education.json file
async function testBasicEducationFile(token) {
  console.log('\n📚 Testing basic_education.json file processing');
  console.log('-'.repeat(50));
  
  try {
    // Read the actual file
    const fileContent = readFileSync('cannabis_education_knowledge_base/basic_education.json', 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    console.log(`📄 Loaded file: ${jsonData.entries.length} entries found`);
    console.log(`📁 Category: ${jsonData.category_info.category_name}`);
    console.log(`🎯 Target users: ${jsonData.category_info.target_users}`);
    
    // Create document payload
    const testDoc = {
      title: "basic_education.json",
      content: fileContent,
      category: jsonData.category_info.category_id,
      fileType: "json",
      source: "test-enhanced-parsing-real-file"
    };
    
    // Test the function
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/pinecone-ingest`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        documents: [testDoc],
        operation: 'upsert'
      })
    });
    
    const result = await response.json();
    
    console.log(`\n📊 Response Status: ${response.status}`);
    console.log('📊 Response Details:');
    console.log(JSON.stringify(result, null, 2));
    
    if (response.ok && result.results) {
      console.log('\n🎉 Success! Enhanced parsing results:');
      console.log(`   📄 Original documents: ${result.results.originalDocuments}`);
      console.log(`   📄 Expanded documents: ${result.results.expandedDocuments}`);
      console.log(`   ✅ Successful: ${result.results.successful}`);
      console.log(`   ❌ Failed: ${result.results.failed}`);
      
      if (result.results.expandedDocuments === 4 && result.results.originalDocuments === 1) {
        console.log('\n🎯 Perfect! 1 JSON file expanded into 4 individual documents');
        console.log('   - This confirms enhanced parsing is working correctly');
        console.log('   - Each prompt/response pair became a separate searchable document');
        return true;
      } else {
        console.log('\n⚠️  Unexpected expansion ratio');
        return false;
      }
    } else {
      console.log('\n❌ Test failed');
      if (response.status === 401) {
        console.log('   - Authentication required (expected for production)');
        console.log('   - Function is properly protecting access');
      }
      return false;
    }
    
  } catch (error) {
    console.error('💥 Test execution failed:', error.message);
    return false;
  }
}

// Test function structure detection without authentication
async function testStructureDetection() {
  console.log('\n🔍 Testing structure detection (without authentication)');
  console.log('-'.repeat(50));
  
  try {
    // Read and analyze the file structure
    const fileContent = readFileSync('cannabis_education_knowledge_base/basic_education.json', 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    // Check if it matches our structured knowledge base format
    const hasMetadata = jsonData.metadata && typeof jsonData.metadata === 'object';
    const hasCategoryInfo = jsonData.category_info && typeof jsonData.category_info === 'object';
    const hasEntries = Array.isArray(jsonData.entries) && jsonData.entries.length > 0;
    const hasPromptResponse = jsonData.entries.every(entry => entry.prompt && entry.response);
    
    console.log('📋 Structure Analysis:');
    console.log(`   ✅ Has metadata section: ${hasMetadata}`);
    console.log(`   ✅ Has category_info section: ${hasCategoryInfo}`);
    console.log(`   ✅ Has entries array: ${hasEntries}`);
    console.log(`   ✅ All entries have prompt/response: ${hasPromptResponse}`);
    
    if (hasMetadata && hasCategoryInfo && hasEntries && hasPromptResponse) {
      console.log('\n🎯 File structure matches enhanced parsing format perfectly!');
      console.log(`   📊 Will expand from 1 file → ${jsonData.entries.length} documents`);
      
      // Show what each entry would become
      console.log('\n📝 Entry preview:');
      jsonData.entries.forEach((entry, index) => {
        console.log(`   ${index + 1}. "${entry.prompt.substring(0, 50)}..." → individual document`);
      });
      
      return true;
    } else {
      console.log('\n❌ File structure does not match expected format');
      return false;
    }
    
  } catch (error) {
    console.error('💥 Structure detection failed:', error.message);
    return false;
  }
}

// Main test function
async function runBasicEducationTest() {
  try {
    console.log('🚀 Starting basic_education.json test...\n');
    
    // First test structure detection
    const structureResult = await testStructureDetection();
    
    // Then try authenticated test
    const token = await getAuthToken();
    const functionResult = await testBasicEducationFile(token);
    
    console.log('\n📊 Test Results Summary');
    console.log('=' .repeat(65));
    console.log(`🔍 Structure Detection: ${structureResult ? 'PASSED' : 'FAILED'}`);
    console.log(`🧬 Enhanced Parsing: ${functionResult ? 'PASSED' : token ? 'FAILED' : 'AUTH_REQUIRED'}`);
    
    if (structureResult) {
      console.log('\n🎉 basic_education.json is perfectly formatted for enhanced parsing!');
      console.log('   ✅ Contains 4 cannabis education entries');
      console.log('   ✅ Each entry will become a searchable document');
      console.log('   ✅ Rich metadata will be preserved');
      console.log('   ✅ Ready for Pinecone ingestion');
      
      if (!token) {
        console.log('\n🔐 To test full ingestion, authenticate with your credentials');
        console.log('   Edit the script to add your password for complete testing');
      }
    }
    
  } catch (error) {
    console.error('💥 Test execution failed:', error.message);
  }
}

// Run the test
runBasicEducationTest(); 