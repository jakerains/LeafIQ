#!/usr/bin/env node

// Configuration
const SUPABASE_URL = 'https://xaddlctkbrdeigeqfswd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZGRsY3RrYnJkZWlnZXFmc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTYxMzgsImV4cCI6MjA2NDIzMjEzOH0.tgbrIR38y92c8tQAwvJeIbIORozOT4GtagJ2-0BNLPM';

console.log('🧪 Testing Pinecone Ingest Function with OpenAI Embeddings');
console.log('=' .repeat(60));

// Function to get superadmin auth token
async function getSuperAdminToken() {
  console.log('🔑 Authenticating as super admin...');
  
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'superadmin@leafiq.online',
    password: 'superadmin123!'
  });
  
  if (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
  
  console.log('✅ Successfully authenticated as super admin');
  return data.session.access_token;
}

// Test 1: Simple text document
async function testSimpleDocument(token) {
  console.log('\n📝 Test 1: Simple text document');
  console.log('-'.repeat(40));
  
  const testDoc = {
    title: "What is THC?",
    content: "THC (tetrahydrocannabinol) is the primary psychoactive compound in cannabis that produces the 'high' sensation. It works by binding to cannabinoid receptors in the brain and central nervous system.",
    category: "basic_education",
    source: "test-simple"
  };
  
  const response = await fetch(`${SUPABASE_URL}/functions/v1/pinecone-ingest`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documents: [testDoc],
      operation: 'upsert'
    })
  });
  
  const result = await response.json();
  
  if (response.ok) {
    console.log('✅ Simple document test passed');
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Results: ${result.results.successful}/${result.results.total} successful`);
    return true;
  } else {
    console.log('❌ Simple document test failed');
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Error: ${result.error}`);
    console.log(`   - Details: ${JSON.stringify(result, null, 2)}`);
    return false;
  }
}

// Test 2: Enhanced JSON parsing (structured knowledge base)
async function testEnhancedJSONParsing(token) {
  console.log('\n🧬 Test 2: Enhanced JSON parsing (structured knowledge base)');
  console.log('-'.repeat(60));
  
  // Create a mini structured knowledge base for testing
  const structuredKnowledgeBase = {
    metadata: {
      document_type: "cannabis_education",
      version: "1.0",
      target_audience: "general_consumers",
      language: "en"
    },
    category_info: {
      category_id: "test_terpenes",
      category_name: "Terpenes Education",
      priority_level: "high",
      target_users: "beginners,intermediate",
      retrieval_tags: ["terpenes", "effects", "aroma", "education"]
    },
    entries: [
      {
        prompt_id: "terp_001",
        prompt: "What are terpenes in cannabis?",
        response: "Terpenes are aromatic compounds found in cannabis and many other plants. They contribute to the distinctive smell and flavor of different cannabis strains, and research suggests they may also influence the effects of cannabis through what's known as the entourage effect.",
        query_type: "definition",
        complexity: "beginner",
        metadata: {
          difficulty: "easy",
          subcategory: "compounds",
          topics: ["terpenes", "aroma", "effects", "entourage_effect"]
        }
      },
      {
        prompt_id: "terp_002", 
        prompt: "What is myrcene and what effects does it have?",
        response: "Myrcene is one of the most common terpenes found in cannabis. It has a musky, earthy aroma and is believed to have sedating and relaxing effects. Strains high in myrcene are often associated with the 'couch-lock' sensation and are typically recommended for evening use or sleep.",
        query_type: "specific_compound",
        complexity: "intermediate",
        metadata: {
          difficulty: "medium",
          subcategory: "specific_terpenes",
          topics: ["myrcene", "sedating", "relaxing", "couch_lock", "sleep"]
        }
      }
    ]
  };
  
  const testDoc = {
    title: "test_terpenes_education.json",
    content: JSON.stringify(structuredKnowledgeBase, null, 2),
    category: "terpenes",
    fileType: "json",
    source: "test-enhanced-parsing"
  };
  
  const response = await fetch(`${SUPABASE_URL}/functions/v1/pinecone-ingest`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documents: [testDoc],
      operation: 'upsert'
    })
  });
  
  const result = await response.json();
  
  if (response.ok) {
    console.log('✅ Enhanced JSON parsing test passed');
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Original documents: ${result.results.originalDocuments}`);
    console.log(`   - Expanded documents: ${result.results.expandedDocuments}`);
    console.log(`   - Successful: ${result.results.successful}/${result.results.total}`);
    
    if (result.results.expandedDocuments > result.results.originalDocuments) {
      console.log('🎉 Enhanced parsing successfully expanded structured knowledge base!');
      return true;
    } else {
      console.log('⚠️  Enhanced parsing did not expand documents as expected');
      return false;
    }
  } else {
    console.log('❌ Enhanced JSON parsing test failed');
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Error: ${result.error}`);
    console.log(`   - Details: ${JSON.stringify(result, null, 2)}`);
    return false;
  }
}

// Main test function
async function runTests() {
  try {
    const token = await getSuperAdminToken();
    
    const test1Result = await testSimpleDocument(token);
    const test2Result = await testEnhancedJSONParsing(token);
    
    console.log('\n📊 Test Results Summary');
    console.log('=' .repeat(60));
    console.log(`✅ Simple Document Test: ${test1Result ? 'PASSED' : 'FAILED'}`);
    console.log(`🧬 Enhanced JSON Parsing Test: ${test2Result ? 'PASSED' : 'FAILED'}`);
    
    const allPassed = test1Result && test2Result;
    console.log(`\n🎯 Overall Result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
    
    if (allPassed) {
      console.log('\n🚀 Pinecone ingestion with OpenAI embeddings is working correctly!');
      console.log('   - OpenAI API key is properly configured');
      console.log('   - Enhanced JSON parsing is working');
      console.log('   - Budbutender index is receiving documents');
    } else {
      console.log('\n🔧 Some tests failed. Check the error details above.');
    }
    
  } catch (error) {
    console.error('💥 Test execution failed:', error.message);
  }
}

// Run the tests
runTests(); 