# LeafIQ - Cannabis Dispensary Copilot

LeafIQ is a premium in-store kiosk and staff assistant that turns customer "vibes" into perfectly matched, in-stock cannabis products, while equipping employees with terpene intelligence and upsell insights.

## Features

- **Customer Kiosk:** An intuitive search interface for customers to find products based on their desired experience.
- **Staff Dashboard:** Enhanced product information and inventory insights for staff.
- **Admin Panel:** Configure API connections, manage syncing, and monitor system performance.
- **AI-Powered Recommendations:** Utilizes GPT-4.1-Mini through Supabase Edge Functions to provide intelligent product matching.
- **Elegant UI:** Glassmorphic design with smooth animations and responsive layouts.

## Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion
- **State Management:** Zustand, React Query
- **Backend:** Supabase (Authentication, Database, Edge Functions)
- **AI Integration:** GPT-4.1-Mini via Supabase Edge Functions

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account (for production use)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/leafiq-dispensary-copilot.git
   cd leafiq-dispensary-copilot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables example:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase credentials.

5. Start the development server:
   ```bash
   npm run dev
   ```

### Supabase Setup

1. Create a new Supabase project.

2. Deploy the Edge Function:
   ```bash
   supabase functions deploy ai-recommendations
   ```

3. Set the OpenAI API key:
   ```bash
   supabase secrets set OPENAI_API_KEY=your-api-key
   ```

4. Create the necessary tables in your Supabase database:
   - `products`
   - `variants`
   - `search_queries`
   - `settings`

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your preferred hosting platform (Netlify, Vercel, etc.).

## Demo Access

- **Kiosk:** Publicly accessible at `/kiosk`
- **Staff Dashboard:** Protected with passcode (Demo: `1234`) at `/staff`
- **Admin Panel:** Protected with passcode (Demo: `admin1234`) at `/admin`

## Project Structure

- `src/components/`: Reusable UI components
- `src/views/`: Page-specific components for kiosk, staff, and admin views
- `src/stores/`: Zustand stores for state management
- `src/utils/`: Utility functions including the recommendation engine
- `src/lib/`: Service integrations (Supabase client)
- `supabase/functions/`: Edge Functions for AI integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.