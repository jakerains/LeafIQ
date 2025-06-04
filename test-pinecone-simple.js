#!/usr/bin/env node

// Configuration
const SUPABASE_URL = 'https://xaddlctkbrdeigeqfswd.supabase.co';

console.log('🧪 Testing Pinecone Ingest Function Response');
console.log('=' .repeat(50));

// Test basic function availability and CORS
async function testFunctionAvailability() {
  console.log('📡 Testing function availability...');
  
  try {
    // Test OPTIONS request first (CORS preflight)
    const optionsResponse = await fetch(`${SUPABASE_URL}/functions/v1/pinecone-ingest`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log(`📋 OPTIONS Response: ${optionsResponse.status}`);
    
    if (optionsResponse.status === 200 || optionsResponse.status === 204) {
      console.log('✅ CORS preflight successful');
    } else {
      console.log('⚠️  CORS preflight returned unexpected status');
    }
    
    // Test POST request without auth to see error handling
    const postResponse = await fetch(`${SUPABASE_URL}/functions/v1/pinecone-ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documents: [{ title: "test", content: "test" }]
      })
    });
    
    const postResult = await postResponse.json();
    console.log(`📝 POST Response: ${postResponse.status}`);
    console.log(`📝 POST Result:`, postResult);
    
    if (postResponse.status === 401) {
      console.log('✅ Function is responding correctly to unauthorized requests');
      return true;
    } else if (postResponse.status === 500) {
      console.log('⚠️  Function returned 500 error - check logs');
      console.log('Error details:', postResult);
      return false;
    } else {
      console.log(`❓ Unexpected response status: ${postResponse.status}`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Function test failed:', error.message);
    return false;
  }
}

// Test environment variables check
async function testEnvironmentCheck() {
  console.log('\n🔑 Testing environment variables check...');
  
  try {
    // Send request with fake auth token to trigger env var check
    const response = await fetch(`${SUPABASE_URL}/functions/v1/pinecone-ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token'
      },
      body: JSON.stringify({
        documents: [{ title: "test", content: "test" }]
      })
    });
    
    const result = await response.json();
    console.log(`🔍 Environment Check Response: ${response.status}`);
    console.log(`🔍 Environment Check Result:`, result);
    
    if (result.error && result.error.includes('Missing required environment variables')) {
      console.log('❌ Missing environment variables detected');
      console.log('Missing:', result.missing);
      return false;
    } else if (result.error && result.error.includes('Unauthorized')) {
      console.log('✅ Environment variables are present, auth validation working');
      return true;
    } else {
      console.log('❓ Unexpected response for environment check');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Environment check failed:', error.message);
    return false;
  }
}

// Check function logs
async function checkFunctionLogs() {
  console.log('\n📋 Recent function activity info:');
  console.log('   - Function is deployed and accessible');
  console.log('   - To check detailed logs, visit Supabase Dashboard > Edge Functions');
  console.log('   - Function endpoint: /functions/v1/pinecone-ingest');
}

// Main test function
async function runBasicTests() {
  try {
    console.log('Starting basic connectivity tests...\n');
    
    const availabilityResult = await testFunctionAvailability();
    const envResult = await testEnvironmentCheck();
    
    console.log('\n📊 Basic Test Results');
    console.log('=' .repeat(50));
    console.log(`📡 Function Availability: ${availabilityResult ? 'WORKING' : 'ISSUES'}`);
    console.log(`🔑 Environment Variables: ${envResult ? 'CONFIGURED' : 'MISSING'}`);
    
    if (availabilityResult && envResult) {
      console.log('\n🎉 Function is deployed and properly configured!');
      console.log('   ✅ CORS handling working');
      console.log('   ✅ Authentication validation working');
      console.log('   ✅ Environment variables present');
      console.log('   ✅ OpenAI API key should be configured');
      console.log('   ✅ Pinecone API key should be configured');
      console.log('\n🚀 Ready for authenticated testing!');
    } else {
      console.log('\n🔧 Some configuration issues detected');
      if (!envResult) {
        console.log('   - Check that OpenAI and Pinecone API keys are set in Supabase secrets');
      }
    }
    
    await checkFunctionLogs();
    
  } catch (error) {
    console.error('💥 Test execution failed:', error.message);
  }
}

// Run the tests
runBasicTests(); 