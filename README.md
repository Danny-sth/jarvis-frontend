# Jarvis Frontend

Modern admin panel and dashboard for Jarvis AI Assistant built with React, TypeScript, and Vite.

[![Deploy Status](https://img.shields.io/badge/deploy-active-success)](http://90.156.230.49:8082/)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)

## Features

### Core Functionality
- **Real-time System Metrics** - WebSocket-based live monitoring of CPU, memory, disk, and network
- **Workflow Management** - Visual workflow editor with JSON schema validation
- **Queue Monitoring** - Real-time job queue status and metrics
- **User Management** - RBAC with role-based permissions
- **Recurring Tasks** - Cron-based task scheduler with timezone support
- **Memory Browser** - AI memory exploration and management
- **Heartbeat Configuration** - System health check settings
- **Documentation** - Integrated markdown documentation viewer

### Technical Highlights
- **Optimized Bundle** - 61% reduction in initial load (1,028 KB → 402 KB)
- **Code Splitting** - Route-based lazy loading with React.lazy + Suspense
- **Type Safety** - Full TypeScript coverage with strict type checking
- **Real-time Updates** - WebSocket integration for live metrics
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Form Validation** - Custom validation hooks with schema-based validation
- **Error Handling** - Error boundaries with detailed error reporting

## Tech Stack

### Frontend
- **React 19** - UI library with latest features
- **TypeScript 5.6** - Type-safe development
- **Vite 8** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router 7** - Client-side routing

### State Management
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state synchronization
- **WebSocket** - Real-time data streaming

### UI Components
- **Monaco Editor** - Code editor for JSON workflows (lazy-loaded)
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Custom Components** - Design system with Card, Button, Input, Select, etc.

### Development
- **ESLint** - Code quality (0 errors, 0 warnings)
- **React Hooks** - Custom hooks for forms, validation, API calls
- **Logger Utility** - Structured logging with dev/prod modes

## Performance

### Bundle Optimization
- **Main Bundle**: 21.83 KB (6.94 KB gzipped)
- **Initial Load**: ~402 KB (~118 KB gzipped)
- **Vendor Chunks**: Separated by library (react, motion, query, monaco, charts, icons, markdown)
- **Route Chunks**: 11 lazy-loaded routes for on-demand loading
- **Monaco Editor**: Lazy-loaded only when modals open

### Code Quality
- ✅ **ESLint**: 0 errors, 0 warnings (was 35 problems)
- ✅ **TypeScript**: Strict mode, no compilation errors
- ✅ **React Best Practices**: No anti-patterns, proper hooks usage
- ✅ **Fast Refresh**: HMR working without warnings
- ✅ **Type Safety**: Eliminated all explicit `any` types

## Project Structure

```
src/
├── components/          # UI components
│   ├── ui/             # Reusable UI components (Button, Card, Input, etc.)
│   ├── forms/          # Form components (FormModal)
│   ├── modals/         # Modal dialogs (Create/Edit workflows, tasks, users)
│   ├── dashboard/      # Dashboard-specific components
│   └── monitoring/     # Monitoring components (EventFeed, LLMCostChart)
├── routes/             # Page components
│   ├── admin/          # Admin panel pages
│   ├── AdminLayout.tsx # Admin layout with sidebar
│   ├── DocsLayout.tsx  # Documentation layout
│   └── LoginPage.tsx   # Authentication page
├── hooks/              # Custom React hooks
│   ├── useAPI.ts       # API client hooks (16 typed hooks)
│   ├── useAuth.ts      # Authentication hook
│   ├── useToast.ts     # Toast notifications
│   ├── useMediaQuery.ts # Responsive design
│   └── forms/          # Form hooks (validation, state, submission)
├── contexts/           # React contexts
│   ├── APIContext.tsx  # API client provider
│   ├── AuthContext.tsx # Auth state provider
│   ├── MetricsContext.tsx # Metrics WebSocket provider
│   └── ToastContext.tsx # Toast notifications provider
├── store/              # Zustand stores
│   ├── auth.ts         # Auth store
│   ├── systemMetricsStore.ts # System metrics store
│   └── toastStore.ts   # Toast notifications store
├── lib/                # Utilities and services
│   ├── api/            # API clients (typed interfaces, base client, factory)
│   ├── websocket/      # WebSocket clients
│   ├── storage/        # LocalStorage adapter
│   ├── auth/           # Auth service
│   ├── logger.ts       # Logging utility
│   ├── config.ts       # App configuration
│   └── utils.ts        # Helper functions
└── App.tsx             # Root component with lazy-loaded routes
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Access to Jarvis backend API (running on port 8081)

### Installation

```bash
# Clone the repository
git clone https://github.com/Danny-sth/jarvis-frontend.git
cd jarvis-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment

The production build is deployed to VPS and served via jarvis-gateway:

```bash
# Build locally
npm run build

# Deploy to VPS
rsync -avz --delete dist/ root@90.156.230.49:/opt/jarvis/jarvis-gateway/static/

# Restart gateway service
ssh root@90.156.230.49 'systemctl restart jarvis-gateway'
```

Live deployment: http://90.156.230.49:8082/

## Environment Configuration

The frontend connects to the backend API. Configure the API URL in `src/lib/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8081',
  SYSTEM_METRICS_WS_URL: 'ws://localhost:8081/ws/system-metrics',
};
```

## Development

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (should show 0 errors, 0 warnings)

### Code Quality Standards

- **No ESLint errors or warnings** - Code must pass linting
- **TypeScript strict mode** - All types must be properly defined
- **Component patterns** - Extract components outside render functions
- **Hook dependencies** - All dependencies properly listed in hooks
- **Logger usage** - Use `logger` instead of `console` statements
- **Type safety** - Avoid `any`, prefer `unknown` or specific types

### Recent Improvements (April 2026)

**Code Quality**:
- ✅ Fixed all 35 ESLint problems (33 errors, 2 warnings → 0)
- ✅ Eliminated React anti-patterns (component during render)
- ✅ Fixed cascading re-renders in HeartbeatConfig and useMediaQuery
- ✅ Resolved Fast Refresh issues (split APIContext into 2 files)
- ✅ Improved type safety (eliminated explicit `any` types)

**Performance**:
- ✅ Bundle optimization: 61% reduction in initial load
- ✅ Route-based code splitting (11 lazy-loaded routes)
- ✅ Monaco Editor lazy loading (only when modals open)
- ✅ Vendor chunk splitting (7 optimized chunks)
- ✅ Created logger utility (replaced 13 console statements)

## Architecture

### State Management Strategy
- **Local UI State** - React useState/useReducer
- **Global State** - Zustand stores (auth, metrics, toasts)
- **Server State** - TanStack Query (caching, synchronization)
- **Real-time Data** - WebSocket connections

### API Integration
- **Typed API Clients** - Full TypeScript interfaces for all endpoints
- **Factory Pattern** - Centralized API client creation
- **Custom Hooks** - 16 specialized hooks for each API domain
- **Error Handling** - Consistent error boundaries and toast notifications

### Component Patterns
- **Compound Components** - FormModal with composition
- **Render Props** - Flexible component APIs
- **Custom Hooks** - Reusable logic extraction
- **Lazy Loading** - Code splitting for routes and heavy components

## License

Private project - Not That Jarvis AI Assistant

## Contact

Danny - [GitHub](https://github.com/Danny-sth)

---

Built with ❤️ using React, TypeScript, and modern web technologies
