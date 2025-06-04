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
- `views/staff/`: Employee tools with enhanced product data
- `views/admin/`: Management dashboard with multiple sub-views
  - `AdminInventory.tsx`: Product/variant management
  - `AdminAIModel.tsx`: AI configuration and testing
  - `AdminSettings.tsx`: System settings
  - `AdminDashboard.tsx`: Analytics and overview

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

- `ai-recommendations`: gpt-4.1-nano-2025-04-14 integration for product recommendations
- `stripe-checkout`: Payment processing
- `stripe-webhook`: Stripe webhook handling

### Key Components

- `AuthGuard.tsx`: Role-based route protection
- `ProductCard.tsx`: Unified product display component
- `SearchInput.tsx`: Enhanced search interface with vibe detection
- `GlassCard.tsx`: Glassmorphic design system component

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