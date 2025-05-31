# LeafIQ Project Structure

This document provides an overview of the LeafIQ project structure and architecture.

## 📁 Project Overview

LeafIQ is an AI-powered cannabis dispensary customer experience platform built with React, TypeScript, and Supabase.

## 🏗️ Architecture

```
LeafIQ/
├── 📁 public/                 # Static assets
├── 📁 src/                    # Source code
│   ├── 📁 components/         # Reusable React components
│   │   ├── 📁 auth/           # Authentication components
│   │   ├── 📁 ui/             # UI components & design system
│   │   └── 📁 forms/          # Form components
│   ├── 📁 data/               # Static data and demo datasets
│   ├── 📁 stores/             # Zustand state management
│   ├── 📁 types/              # TypeScript type definitions
│   ├── 📁 utils/              # Utility functions
│   ├── 📁 views/              # Page-level components
│   │   ├── 📁 admin/          # Admin dashboard
│   │   ├── 📁 auth/           # Authentication pages
│   │   ├── 📁 kiosk/          # Customer kiosk interface
│   │   ├── 📁 staff/          # Staff interface
│   │   └── 📁 pricing/        # Pricing and checkout
│   └── 📄 main.tsx            # Application entry point
├── 📁 docs/                   # Project documentation
└── 📄 package.json            # Dependencies and scripts
```

## 🧩 Core Components

### Authentication System
- **Location**: `src/components/auth/`
- **Purpose**: User authentication, authorization, and role-based access control
- **Key Files**:
  - `AuthGuard.tsx` - Route protection component
  - `LoginForm.tsx` - User login interface
  - `RegisterForm.tsx` - User registration interface

### UI Components
- **Location**: `src/components/ui/`
- **Purpose**: Reusable design system components
- **Key Files**:
  - `Button.tsx` - Primary button component
  - `GlassCard.tsx` - Glassmorphism card design
  - `Logo.tsx` - Company logo component
  - `VersionDisplay.tsx` - Dynamic version display

### State Management
- **Location**: `src/stores/`
- **Technology**: Zustand
- **Key Stores**:
  - `authStore.ts` - Authentication state
  - `productsStore.ts` - Product catalog and search
  - `settingsStore.ts` - Application settings

### Views (Pages)
- **Location**: `src/views/`
- **Structure**:
  - `LandingPage.tsx` - Public homepage
  - `DemoView.tsx` - Interactive demo mode
  - `kiosk/` - Customer-facing kiosk interface
  - `admin/` - Administrative dashboard
  - `staff/` - Staff management interface

## 🔧 Key Features

### AI-Powered Recommendations
- **Engine**: `src/utils/recommendationEngine.ts`
- **Data**: `src/data/demoData.ts`
- **Algorithm**: Terpene profile matching with user preferences

### Demo Mode
- **Entry Point**: `/demo`
- **Purpose**: Showcase platform capabilities
- **Navigation**: Seamless switching between admin and customer views

### Kiosk Interface
- **Route**: `/kiosk/*`
- **Design**: Touch-optimized customer interface
- **Features**: Product search, AI recommendations, intuitive navigation

### Admin Dashboard
- **Route**: `/admin/*`
- **Access**: Role-based authentication required
- **Features**: Product management, analytics, settings

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend & Database
- **Platform**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime

### State Management
- **Primary**: Zustand
- **Caching**: TanStack Query (React Query)

### Routing
- **Library**: React Router v6
- **Structure**: Nested routes with protected areas

## 📊 Data Flow

1. **User Interaction** → UI Components
2. **State Updates** → Zustand Stores
3. **API Calls** → Supabase Services
4. **Real-time Updates** → Component Re-renders
5. **AI Processing** → Recommendation Engine

## 🚀 Development Workflow

### Getting Started
```bash
npm install           # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
```

### Version Management
- **Current Version**: Tracked in `package.json`
- **Changelog**: `docs/CHANGELOG.md`
- **Display**: Dynamic version component in UI

### Code Organization
- **Components**: Small, reusable, single-responsibility
- **Stores**: Feature-based state management
- **Utils**: Pure functions for business logic
- **Types**: Comprehensive TypeScript definitions

## 🔒 Security & Access Control

### Authentication Flow
1. User registration/login
2. JWT token storage
3. Role-based route protection
4. API request authentication

### Role Hierarchy
- **Customer**: Kiosk access only
- **Staff**: Limited admin features
- **Admin**: Full platform access

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (Kiosk optimized)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (Admin/Staff interfaces)

### Interface Adaptation
- **Kiosk**: Touch-optimized, large buttons
- **Admin**: Dense information display
- **Demo**: Showcases both interfaces

## 🧪 Testing Strategy

### Component Testing
- Unit tests for utilities
- Component integration tests
- E2E tests for critical workflows

### Demo Data
- **Location**: `src/data/demoData.ts`
- **Purpose**: Consistent testing and demonstration
- **Content**: 28 products across all cannabis categories

---

*Last Updated: January 2024*
*Version: 0.1.0* 