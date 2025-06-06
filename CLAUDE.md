# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy using bash scripts/deploy.sh
- `npm run version:show` - Show current version
- `npm run version:patch` - Bump patch version
- `npm run version:minor` - Bump minor version
- `npm run version:major` - Bump major version
- `npm run create-superadmin` - Create superadmin user

## Code Quality

- **Linting**: ESLint with TypeScript support
- **Type Checking**: Run TypeScript compiler with `npx tsc --noEmit`
- **Bundle Analysis**: Knip for unused code detection

## Architecture Overview

LeafIQ is a React + TypeScript cannabis dispensary copilot with three main interfaces:

### Core Application Structure

- **Routing**: React Router with nested routes for different user roles
- **State Management**: Zustand stores for authentication and products
- **Backend**: Supabase for auth, database, and AI edge functions
- **Styling**: Tailwind CSS with glassmorphic design system

### Authentication System

Dual authentication approach:
1. **Passcode-based** for demo/kiosk access (staff: `1234`, admin: `admin1234`)
2. **Supabase auth** for full user accounts with organization management

The `authStore.ts` handles both methods, checking for Supabase sessions first, then falling back to localStorage for passcode auth. Two separate auth stores exist:
- `authStore.ts`: Primary Supabase-based authentication
- `simpleAuthStore.ts`: Passcode-based demo authentication

### User Roles & Access

- **Kiosk** (`/kiosk/*`): Public product search interface
- **Staff** (`/staff/*`): Enhanced product info with terpene data (requires staff passcode/auth)
- **Admin** (`/admin/*`): Full dashboard with inventory, AI model config, settings (requires admin auth)

### Product Recommendation Engine

Located in `utils/recommendationEngine.ts`. Hybrid approach:
1. **AI-powered**: Calls Supabase edge function `ai-recommendations` using gpt-4.1-nano-2025-04-14
2. **Fallback**: Local terpene-based matching using similarity algorithms
3. **Logging**: All searches logged to `search_queries` table for analytics

Key functions:
- `recommendProducts()`: Main entry point, tries AI first then local fallback
- `parseVibeToTerpeneProfile()`: Maps user input to terpene profiles
- `calculateTerpeneSimilarity()`: Scores products against target profiles

### Views Structure

- `views/kiosk/`: Customer-facing search interface
- `views/staff/`: Employee tools with enhanced product data and multiple work modes
- `views/admin/`: Management dashboard with multiple sub-views
  - `AdminInventory.tsx`: Product/variant management
  - `AdminAIModel.tsx`: AI configuration and testing
  - `AdminSettings.tsx`: System settings
  - `AdminDashboard.tsx`: Analytics and overview

### Staff Interface Modes

The staff interface includes multiple specialized modes accessible via `StaffModeSelector`:

- **Product Search Mode** (`ProductSearchMode.tsx`): Advanced product filtering and search with AI-powered recommendations
- **Staff Chatbot Mode** (`StaffChatbotMode.tsx`): **NEW** - Conversational AI budtender assistant with persistent chat context
- **Terpene Explorer Mode** (`TerpeneExplorerMode.tsx`): Interactive terpene education and product matching
- **Inventory Mode** (`StaffInventoryMode.tsx`): Real-time inventory management and stock checking
- **Consultation Mode**: Coming soon - Customer consultation tools
- **Training Mode**: Coming soon - Staff education and knowledge base
- **Analytics Mode**: Coming soon - Performance metrics and insights

### Data Flow

1. Products stored in `demoData.ts` (demo mode) or Supabase tables
2. `productsStore.ts` manages product state and search operations
3. Search queries processed through recommendation engine
4. Results displayed with terpene profiles and inventory levels
5. All interactions logged for analytics

### Environment Configuration

Required environment variables:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key

### Supabase Edge Functions

- `ai-recommendations`: gpt-4.1-nano-2025-04-14 integration for product recommendations **with cannabis-only guardrails**
- `cannabis-knowledge-rag`: Cannabis education Q&A using knowledge base **with cannabis-only guardrails**
- `pinecone-ingest`: Vector database ingestion for knowledge base
- `stripe-checkout`: Payment processing
- `stripe-webhook`: Stripe webhook handling

**AI Guardrails**: Both chatbot functions (`cannabis-knowledge-rag` and `ai-recommendations`) include **strengthened strict topic boundaries** that keep conversations focused exclusively on cannabis-related topics. They will give a clean redirect response for any non-cannabis questions.

**Guardrail Response**: Non-cannabis questions receive exactly this simple response: *"I'm an AI bud tender, so I'm happy to talk about cannabis-related things. What would you like to know about cannabis?"*

**Cannabis Cooking Allowed**: The guardrails explicitly allow cannabis cooking topics including edibles preparation, decarboxylation, cannabis infusions, cannabutter, cannabis recipes, and cannabis food preparation as these are legitimate cannabis topics.

### Key Components

- `AuthGuard.tsx`: Role-based route protection
- `ProductCard.tsx`: Unified product display component
- `SearchInput.tsx`: Enhanced search interface with vibe detection
- `GlassCard.tsx`: Glassmorphic design system component
- `StaffChatbotMode.tsx`: **NEW** - Conversational AI assistant with persistent context and inventory integration
- `CannabisQuestionsChat.tsx`: Customer-facing cannabis education chatbot
- `ResponseStream.tsx`: Streaming text display component for real-time AI responses

### Styling Conventions

- Glassmorphic design with backdrop blur effects
- Tailwind CSS with custom color scheme (primary-* variants)
- Framer Motion for animations
- Responsive design for kiosk displays

### Demo Data

All product data in `data/demoData.ts` includes:
- Product information with categories and descriptions
- Variant data with terpene profiles and inventory levels
- Vibe-to-terpene mappings for recommendation engine

### TypeScript Types

Centralized in `types/index.ts`:
- `Product`, `Variant`, `ProductWithVariant` for product data
- `TerpeneProfile` for cannabis terpene data
- `UserRole` for authentication roles
- Supabase types in `types/supabase.ts`

### Key File Locations

- **Demo Credentials**: Staff (`1234`), Admin (`admin1234`) - hardcoded in auth components
- **Product Data**: `src/data/demoData.ts` for demo products and terpene mappings
- **Bulk Loading Scripts**: Root level `.js` files for data import/export
- **Deployment**: `scripts/deploy.sh` for production deployment
- **Supabase Functions**: `supabase/functions/` for edge functions
- **Cannabis Knowledge Base**: `cannabis_education_knowledge_base/` with JSON files for educational content
- **Demo Data**: `truenorthdemodata/` with sample dispensary inventory data

### Demo Features

Demo credentials provide full access to test all features:
- Staff: Access to enhanced product search, terpene data, **conversational AI budtender assistant**, and customer assistance tools
- Admin: Full dashboard access including inventory management, analytics, and AI configuration

Use demo mode to test the complete system without requiring actual inventory or user data.

### Recent Updates

**Staff Chatbot Enhancement** (Latest):
- Replaced single-shot AI assistant with full conversational chatbot interface
- **Persistent conversation context**: Chat maintains context throughout the session
- **Live inventory integration**: Real-time product recommendations based on current stock
- **Pinecone knowledge base**: Accesses cannabis education database for expert answers
- **Contextual product suggestions**: Uses conversation history for smarter recommendations
- **Enhanced UX**: Professional chat interface with typing indicators, conversation history, and product detail modals
- **Staff-focused features**: Designed specifically for employee use with advanced cannabis knowledge and inventory access
- **🚫 Cannabis-only guardrails**: Both customer and staff chatbots now strictly stay on cannabis topics and politely redirect non-cannabis questions

The new `StaffChatbotMode.tsx` provides a ChatGPT-like experience specifically tailored for cannabis dispensary staff, combining conversational AI with live inventory data and specialized cannabis knowledge. **All AI responses are now properly guardrailed to maintain focus on cannabis expertise only.**