# Setting Up AI-Powered Recommendations

## Overview

The LeafIQ recommendation engine has two modes:

1. **AI-Powered Mode**: Uses GPT-4o-mini to understand complex natural language and provide sophisticated recommendations
2. **Fallback Mode**: Uses local terpene profile matching and keyword detection

Currently, the system is running in **Fallback Mode** because no OpenAI API key is configured.

## Setting Up AI Mode

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-...`)

### 2. Set the API Key in Supabase

```bash
# Using Supabase CLI
supabase secrets set OPENAI_API_KEY=your-api-key-here

# Or manually in Supabase Dashboard:
# 1. Go to Project Settings > Edge Functions
# 2. Add secret: OPENAI_API_KEY = your-api-key
```

### 3. Verify AI is Working

Test with a complex query:

```bash
curl -X POST 'https://xaddlctkbrdeigeqfswd.supabase.co/functions/v1/ai-recommendations' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"vibe": "I have social anxiety but want to be more talkative at a dinner party without getting too high"}'
```

## AI Capabilities When Enabled

### Natural Language Understanding
The AI can understand:
- **Complex scenarios**: "watching a 3-hour movie with friends but don't want to fall asleep"
- **Medical conditions**: "chronic pain but need to stay productive at work"
- **Social situations**: "first date, want to be relaxed but not impaired"
- **Specific concerns**: "avoid paranoia but help with creativity"

### Smart Product Matching
The AI considers:
- **Terpene profiles** that match the described effects
- **THC/CBD ratios** appropriate for the situation
- **Strain types** (sativa/indica/hybrid) for desired experience
- **Timing and duration** of effects

### Example AI Response
```json
{
  "recommendations": [
    {
      "productId": "p007",
      "confidence": 0.95,
      "reason": "This hybrid strain has balanced CBD:THC (2:1) with limonene and pinene terpenes, perfect for social anxiety relief without sedation. The moderate THC won't interfere with following complex movie plots."
    }
  ],
  "effects": ["Social Ease", "Mild Relaxation", "Mental Clarity"],
  "query_analyzed": "User needs anxiety relief for social situation while maintaining alertness for extended focus. Recommending balanced hybrids with CBD content."
}
```

## Current Fallback System

Without OpenAI, the system still provides good recommendations using:

1. **Keyword Detection**: Recognizes key terms like "relax", "energy", "creative"
2. **Terpene Profile Matching**: Maps effects to specific terpene combinations
3. **Category Filtering**: Understands product types (flower, edibles, concentrates)
4. **Inventory Awareness**: Only recommends available products

## Cost Considerations

- OpenAI API calls cost approximately $0.001-0.003 per recommendation
- For a busy dispensary (1000 searches/day), monthly cost would be ~$30-90
- AI greatly improves customer satisfaction and sales conversion

## Setting Up (Commands)

If you want to enable AI recommendations:

```bash
# 1. Set the OpenAI API key (you'll need to get one from OpenAI)
supabase secrets set OPENAI_API_KEY=sk-your-openai-key-here

# 2. Restart the edge function (automatic with secret update)

# 3. Test that AI is working
curl -X POST 'https://your-supabase-url.supabase.co/functions/v1/ai-recommendations' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"vibe": "complex query here"}'
``` 