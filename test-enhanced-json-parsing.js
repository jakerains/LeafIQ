import fs from 'fs';
import fetch from 'node-fetch';

const SUPABASE_URL = 'https://xaddlctkbrdeigeqfswd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZGRsY3RrYnJkZWlnZXFmc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTYxMzgsImV4cCI6MjA2NDIzMjEzOH0.tgbrIR38y92c8tQAwvJeIbIORozOT4GtagJ2-0BNLPM';

// Test the enhanced JSON parsing with cannabis education knowledge base
async function testEnhancedJSONParsing() {
  try {
    console.log('🧪 Testing Enhanced JSON Parsing for Cannabis Knowledge Base');
    console.log('=' .repeat(60));

    // Read one of the cannabis education JSON files
    const testFile = 'cannabis_education_knowledge_base/basic_education.json';
    console.log(`📁 Reading test file: ${testFile}`);
    
    const fileContent = fs.readFileSync(testFile, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    console.log(`📊 Original file contains ${jsonData.entries?.length || 0} entries`);
    console.log(`📋 Category: ${jsonData.category_info?.category_name || 'Unknown'}`);
    console.log('');

    // Prepare the test document for upload
    const testDocument = {
      title: `Test: ${jsonData.category_info?.category_name || 'Cannabis Knowledge Base'}`,
      content: fileContent,
      category: 'cannabis-education',
      source: 'test-enhanced-parsing',
      fileType: 'json'
    };

    console.log('🚀 Uploading to pinecone-ingest function...');
    
    // Get auth token using superadmin credentials
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: 'jakerains@gmail.com',
        password: 'SuperAdmin2025!'
      })
    });

    if (!authResponse.ok) {
      throw new Error(`Auth failed: ${authResponse.status} ${authResponse.statusText}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    
    console.log('✅ Authentication successful');

    // Test the pinecone-ingest function
    const ingestResponse = await fetch(`${SUPABASE_URL}/functions/v1/pinecone-ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        documents: [testDocument],
        operation: 'upsert'
      }),
    });

    if (!ingestResponse.ok) {
      const errorText = await ingestResponse.text();
      throw new Error(`Ingest failed: ${ingestResponse.status} ${ingestResponse.statusText}\n${errorText}`);
    }

    const result = await ingestResponse.json();
    
    console.log('📈 Upload Results:');
    console.log(`   ✅ Success: ${result.success}`);
    console.log(`   📄 Original Documents: ${result.results?.originalDocuments || 1}`);
    console.log(`   📚 Expanded Documents: ${result.results?.expandedDocuments || 1}`);
    console.log(`   ✅ Successful: ${result.results?.successful || 0}`);
    console.log(`   ❌ Failed: ${result.results?.failed || 0}`);
    
    if (result.results?.expandedDocuments > result.results?.originalDocuments) {
      console.log('');
      console.log('🎉 ENHANCED PARSING WORKING!');
      console.log(`   The JSON file was successfully split from ${result.results.originalDocuments} file`);
      console.log(`   into ${result.results.expandedDocuments} individual knowledge base entries!`);
    } else {
      console.log('');
      console.log('⚠️  Enhanced parsing may not have triggered');
      console.log('   Check if the JSON structure matches the expected knowledge base format');
    }

    console.log('');
    console.log('📋 Full Results:');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testEnhancedJSONParsing(); 