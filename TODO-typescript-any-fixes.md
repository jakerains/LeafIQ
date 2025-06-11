# TODO: Fix `any` Types in Core Functions

This document outlines the high-priority TypeScript `any` type fixes needed in core LeafIQ functions. These fixes will improve type safety, catch runtime errors, and make debugging easier.

## 🔧 General Approach for Safe Fixes

1. **Create proper interfaces first** - Define the expected data structures
2. **Add runtime validation** - Use type guards or validation libraries
3. **Test incrementally** - Fix one function at a time and test thoroughly
4. **Maintain backward compatibility** - Ensure existing API contracts remain intact

---

## 1. Core Supabase Functions (`src/lib/supabase.ts`)

### Issue: `logSearchQuery()` function parameter
- **Location**: Line 95
- **Current**: `results?: any[]`
- **Problem**: Search results aren't properly typed, making it hard to know what data structure is expected

### Fix Plan:
```typescript
// 1. Create proper interface in src/types/index.ts
interface SearchResult {
  productId: string;
  score: number;
  matchedTerms: string[];
  product: ProductWithVariant;
}

// 2. Update function signature
export const logSearchQuery = async (
  query: string,
  searchType: string,
  userId?: string,
  organizationId?: string,
  results?: SearchResult[]  // Instead of any[]
) => {
```

### Testing Strategy:
- Test all search logging calls in kiosk, staff, and admin views
- Verify analytics data is still properly captured
- Check that recommendation engine still logs correctly

---

## 2. Inventory Data Management (`src/utils/inventoryImporter.ts`)

### Issue: Import validation and processing functions
- **Locations**: Lines 57, 89, 111, 323, 329
- **Problem**: Import data structure isn't typed, making validation unreliable

### Fix Plan:
```typescript
// 1. Create comprehensive import interfaces
interface ImportData {
  metadata: ImportMetadata;
  products: ImportProduct[];
}

interface ImportProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  strain_type: string;
  variants: ImportVariant[];
}

interface ImportVariant {
  id: string;
  size: string;
  unit: string;
  price: number;
  inventory_count: number;
  thc_percentage?: number;
  cbd_percentage?: number;
  terpene_profile?: TerpeneProfile;
}

// 2. Update function signatures
export function validateImportData(data: unknown): { valid: boolean; errors: string[] } {
  // Add runtime type checking
  if (!isImportData(data)) {
    return { valid: false, errors: ['Invalid data structure'] };
  }
  // Continue with typed validation
}

// 3. Create type guards
function isImportData(data: unknown): data is ImportData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'metadata' in data &&
    'products' in data &&
    Array.isArray((data as any).products)
  );
}
```

### Testing Strategy:
- Test with existing inventory files in `truenorthdemodata/`
- Test import failure scenarios
- Verify bulk loading scripts still work (`bulk-load-products.js`, etc.)
- Test with malformed JSON to ensure proper error handling

---

## 3. AI Chat and Recommendation Components

### Issue: Chat message handling
- **Files**: `CannabisQuestionsChat.tsx`, `v0-ai-chat.tsx`
- **Lines**: 17, 18, 68, 135, 142
- **Problem**: AI responses and chat messages aren't properly typed

### Fix Plan:
```typescript
// 1. Create chat message interfaces
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    searchQuery?: string;
    recommendedProducts?: string[];
    confidence?: number;
  };
}

interface AIResponse {
  message: string;
  recommendedProducts?: ProductWithVariant[];
  confidence: number;
  sources?: string[];
}

// 2. Update component state and handlers
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);

const handleAIResponse = (response: AIResponse) => {
  // Properly typed response handling
};
```

### Testing Strategy:
- Test chat functionality in both kiosk and staff modes
- Verify product recommendations still work
- Test error scenarios (network failures, malformed responses)
- Check streaming text responses still display correctly

---

## 4. Admin Dashboard Functions

### Issue: Admin configuration and data handling
- **Files**: `AdminAIModel.tsx`, `SuperadminPanel.tsx`
- **Lines**: 12, 30, 128, 200
- **Problem**: Dashboard data and AI model configs aren't typed

### Fix Plan:
```typescript
// 1. Create admin interfaces
interface AIModelConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enabledFeatures: string[];
}

interface DashboardStats {
  totalSearches: number;
  uniqueUsers: number;
  topProducts: Array<{
    id: string;
    name: string;
    searchCount: number;
  }>;
  conversionRate: number;
}

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  organizationId: string;
  lastLogin: Date;
}

// 2. Update component props and state
const [config, setConfig] = useState<AIModelConfig | null>(null);
const [stats, setStats] = useState<DashboardStats | null>(null);
```

### Testing Strategy:
- Test admin dashboard loading and data display
- Verify AI model configuration changes work
- Test user management functions
- Check analytics and reporting features

---

## 5. Edge Functions (Supabase)

### Issue: Vector database and AI processing
- **File**: `supabase/functions/pinecone-ingest/index.ts`
- **Lines**: 371, 385, 393, 433, 476, 493, 494
- **Problem**: Vector embeddings and AI responses aren't typed

### Fix Plan:
```typescript
// 1. Create edge function interfaces
interface VectorEmbedding {
  id: string;
  values: number[];
  metadata: {
    content: string;
    source: string;
    category: string;
  };
}

interface PineconeUpsertRequest {
  vectors: VectorEmbedding[];
  namespace?: string;
}

interface OpenAIEmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

// 2. Update function parameters
async function generateEmbeddings(text: string): Promise<number[]> {
  const response = await fetch(openaiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-ada-002'
    })
  });

  const data: OpenAIEmbeddingResponse = await response.json();
  return data.data[0].embedding;
}
```

### Testing Strategy:
- Test knowledge base ingestion with cannabis education data
- Verify vector search still returns relevant results
- Test edge function deployment
- Check error handling for API failures

---

## 🚀 Implementation Order

1. **Start with types** - Create all interfaces in `src/types/` first
2. **Fix supabase.ts** - Core logging function (lowest risk)
3. **Fix chat components** - User-facing features
4. **Fix inventory importer** - Business critical but less frequently used
5. **Fix admin functions** - Admin-only features
6. **Fix edge functions** - Deploy and test separately

## 🧪 Testing Checklist

For each fix:
- [ ] TypeScript compilation passes
- [ ] Unit tests pass (if they exist)
- [ ] Manual testing in development
- [ ] Test with demo data
- [ ] Test error scenarios
- [ ] Verify no breaking changes to existing APIs
- [ ] Test in staging environment before production

## 📋 Risk Mitigation

- **Create feature flags** - Allow rolling back type changes if needed
- **Maintain runtime validation** - Don't rely solely on TypeScript
- **Keep old function signatures** - Add new typed versions alongside existing ones initially
- **Monitor production** - Watch for any runtime errors after deployment