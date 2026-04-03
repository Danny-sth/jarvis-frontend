# ⛔⛔⛔ НИКОГДА НИЧЕГО НЕ УПРОЩАТЬ!!! ⛔⛔⛔

**МЫ ДЕЛАЕМ СЛОЖНЫЕ ПРОДУКТЫ! НИКАКИХ ЗАГЛУШЕК И ВРЕМЕННЫХ ПРОСТЫХ РЕШЕНИЙ!**
**ИСПОЛЬЗУЕМ ТОКЕНЫ МАКСИМАЛЬНО! ПРИОРИТЕТ — КАЧЕСТВО, А НЕ ПРОСТОТА РАЗРАБОТКИ!**

---

# Jarvis Frontend

> React admin dashboard for JARVIS AI assistant with cyberpunk/Iron Man aesthetic.

## ⛔⛔⛔ НИКОГДА REBASE!!! ⛔⛔⛔

```
╔══════════════════════════════════════════════════════════════╗
║  НАД ПРОЕКТОМ РАБОТАЮТ НЕСКОЛЬКО АГЕНТОВ!                    ║
║                                                              ║
║  🚫 git pull --rebase  — ЗАПРЕЩЕНО!!!                        ║
║  🚫 git rebase         — ЗАПРЕЩЕНО!!!                        ║
║  🚫 git push --force   — ЗАПРЕЩЕНО!!!                        ║
║                                                              ║
║  ✅ git pull           — OK (merge)                          ║
║  ✅ git revert         — OK (для отмены)                     ║
╚══════════════════════════════════════════════════════════════╝
```

## Quick Deploy

```bash
# Build + Deploy + Verify
npm run build && \
rsync -avz --delete dist/ root@90.156.230.49:/opt/jarvis/jarvis-gateway/static/ && \
ssh root@90.156.230.49 "systemctl restart jarvis-gateway && curl -I https://on-za-menya.online/"
```

## VPS Access

```bash
ssh root@90.156.230.49     # SSH
ls -la /opt/jarvis/jarvis-gateway/static/  # Check deployed files
systemctl restart jarvis-gateway  # Restart gateway after deploy
journalctl -u jarvis-gateway -f   # Check gateway logs
```

## Architecture

```
User Browser
     ↓
https://on-za-menya.online (TLS :443)
     ↓
jarvis-gateway :443 (Go + TLS)
     ├── Static Files (/opt/jarvis/jarvis-gateway/static/)
     ├── HTTP :80 → HTTPS redirect
     └── API Proxy (/api/* → :8081)
          ↓
     Jarvis Backend :8081 (FastAPI)
```

## Critical Rules

1. **ALWAYS** `npm run build` перед деплоем
2. **SOLID Principles** — код полностью отрефакторен (Phase 1-6 complete)
3. **TypeScript strict mode** — NO any types without good reason
4. **API через facade hooks** — useAuth, useMetrics, useToast (DI готов)
5. **NO прямой import stores** — только через Context Providers

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript 5.9
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 4 (custom Jarvis theme)
- **State**: Zustand (auth, metrics, toasts)
- **Data Fetching**: TanStack Query v5
- **UI Effects**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Code Editor**: Monaco Editor React

## SOLID Refactoring (Completed ✓)

Проект прошел полный рефакторинг по принципам SOLID:

### Phase 1: API Client Separation ✓
- **До**: Монолитный класс 800 строк, 44 метода
- **После**: 11+ domain-specific клиентов (<100 строк каждый)
- **Файлы**: `src/lib/api/` (interfaces + clients + factory)

### Phase 2: Storage Abstraction ✓
- **Auth Store**: 93 строки → 70 (AuthService + LocalStorageAdapter)
- **Metrics Store**: 87 строк → 50 (WebSocket client вынесен, memory leak fixed)
- **Файлы**: `src/lib/storage/`, `src/lib/auth/`, `src/lib/websocket/`

### Phase 3: Dashboard Decomposition ✓
- **До**: 335 строк, смешанные ответственности
- **После**: 35 строк orchestrator
- **Файлы**: `src/components/dashboard/` (4 cards + custom hook)

### Phase 4: Form Hooks + Components ✓
- **Создано**: useFormState, useFormValidation, useFormSubmission
- **Создано**: FormModal, FormField (переиспользуемые)
- **Рефакторинг**: 5 модальных окон (DRY pattern)

### Phase 5: Dependency Injection ✓
- **Context Providers**: AuthContext, MetricsContext, ToastContext
- **Facade Hooks**: useAuth, useMetrics, useToast
- **App.tsx**: Обернут в 4 Provider слоя

### Phase 6: Minor Fixes ✓
- Sidebar: window.location → navigate()
- EventFeed: hardcoded switch → eventMappings.ts
- AnimatedProgress: унифицированы prop types

## Key Files After Refactoring

### API Layer
```
src/lib/api/
├── base/BaseAPIClient.ts           # Общая логика request()
├── interfaces/                     # 11 интерфейсов (IAuthAPI, IQueueAPI, ...)
├── clients/                        # 11 реализаций
└── factory/APIFactory.ts           # DI контейнер
```

### Services & Stores
```
src/lib/
├── auth/AuthService.ts             # Auth бизнес-логика
├── storage/LocalStorageAdapter.ts  # Storage абстракция
└── websocket/SystemMetricsWSClient.ts  # WebSocket client (вне store!)

src/store/
├── auth.ts                         # Только state (70 строк)
├── systemMetricsStore.ts           # Только state (50 строк, no memory leak)
└── toastStore.ts                   # Toast queue
```

### Forms & Components
```
src/hooks/forms/
├── useFormState.ts                 # Generic form state
├── useFormValidation.ts            # Schema-based validation
└── useFormSubmission.ts            # Mutation + toast + invalidation

src/components/forms/
├── FormModal.tsx                   # Reusable modal wrapper
└── FormField.tsx                   # Unified field component

src/components/dashboard/
├── QueueStatsCard.tsx
├── SystemHealthCard.tsx
├── LLMMetricsSection.tsx
├── APIPerformanceCard.tsx
└── hooks/useSystemMetricsConnection.ts
```

### Dependency Injection
```
src/contexts/
├── APIContext.tsx                  # API Factory provider
├── AuthContext.tsx                 # Auth state provider
├── MetricsContext.tsx              # Metrics state provider
└── ToastContext.tsx                # Toast state provider

src/hooks/
├── useAuth.ts                      # Facade over AuthContext
├── useMetrics.ts                   # Facade over MetricsContext
└── useToast.ts                     # Facade over ToastContext
```

## Routing Structure

```
/login                   → Public login page
/docs                    → Public documentation (no auth)
/docs/:page              → Specific doc pages
/admin                   → Protected admin panel (requires auth)
  ├─ / (index)           → Dashboard (metrics, activity feed, LLM costs)
  ├─ /queue              → Queue Monitor (task management)
  ├─ /heartbeat          → Heartbeat Config (monitoring checks)
  ├─ /workflows          → Workflow Editor (CRUD workflows)
  ├─ /recurring          → Recurring Tasks (cron jobs)
  ├─ /memory             → Memory Browser (cortex search)
  ├─ /system             → System Health (CPU/memory/disk)
  └─ /users              → User Management (admin/root only)
```

## Development Workflow

### 1. Local Development
```bash
npm run dev              # Start dev server (localhost:5173)
npm run lint             # Check TypeScript/ESLint
```

### 2. Build
```bash
npm run build            # TypeScript compilation + Vite build
npm run preview          # Preview production build locally
```

### 3. Deploy to VPS
```bash
# Full deploy pipeline
npm run build && \
rsync -avz --delete dist/ root@90.156.230.49:/opt/jarvis/jarvis-gateway/static/ && \
ssh root@90.156.230.49 "systemctl restart jarvis-gateway"
```

### 4. Verify
```bash
# Check deployed version
curl -I https://on-za-menya.online/admin

# Check jarvis-gateway logs
ssh root@90.156.230.49 "journalctl -u jarvis-gateway -n 50 --no-pager"
```

## API Integration

### Base URL
- **Local Dev**: `/api` (proxied by Vite to localhost:8081)
- **Production**: `/api` (proxied by jarvis-gateway to jarvis:8081)

### Authentication
- Bearer token stored in `localStorage` as `jarvis_token`
- Automatically attached to all requests via `APIFactory`
- 401 responses trigger automatic logout + redirect to `/login`

### Domain-Specific API Clients

Используй facade hooks через Context:

```typescript
import { useAuth } from '../hooks/useAuth';
import { useQueueAPI } from '../contexts/APIContext';

function MyComponent() {
  const { userId } = useAuth();  // Вместо useAuthStore
  const queueAPI = useQueueAPI();

  const { data } = useQuery({
    queryKey: ['queue-stats'],
    queryFn: () => queueAPI.getQueueStats(),
  });
}
```

## Real-Time Features

### WebSocket Connection
```typescript
// SystemMetricsWSClient автоматически подключается
// Используй через useMetrics hook:
import { useMetrics } from '../hooks/useMetrics';

function Dashboard() {
  const { metrics, isConnected } = useMetrics();

  // metrics обновляется в реальном времени
}
```

- Auto-reconnects on disconnect (3s delay)
- Updates CPU, memory, disk usage in real-time
- **CRITICAL**: WebSocket клиент НЕ хранится в Zustand store (memory leak fixed!)

## Theme System

Custom Jarvis theme (Tailwind v4 `@theme` syntax):

### Color Palette
- Background: `jarvis-bg-dark` (#0a0a0a), `jarvis-bg-sidebar` (#0f0f0f)
- Accents: `jarvis-cyan`, `jarvis-red`, `jarvis-orange`, `jarvis-gold`
- Text: `jarvis-text-primary`, `jarvis-text-secondary`, `jarvis-text-muted`

### Fonts
- Display (headings): `font-display` → Orbitron
- Body: `font-body` → Rajdhani
- Mono (code): `font-mono` → JetBrains Mono

### Animations
`pulse-glow`, `scan`, `float`, `slide-in`, `fade-in`, `glow-pulse`

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview prod build locally
npm run lint             # Lint TypeScript/ESLint

# Deploy
rsync -avz --delete dist/ root@90.156.230.49:/opt/jarvis/jarvis-gateway/static/
ssh root@90.156.230.49 "systemctl restart jarvis-gateway"

# Check logs
ssh root@90.156.230.49 "journalctl -u jarvis-gateway -f"
ssh root@90.156.230.49 "journalctl -u jarvis.service -f"
```

## Backend Services

| Service | Port | Path | Purpose |
|---------|------|------|---------|
| `jarvis.service` | 8081 | `/opt/jarvis/current` | Python AI Agent (FastAPI) |
| `jarvis-gateway.service` | 443 (TLS) | `/opt/jarvis/jarvis-gateway` | Go API proxy + Static files + TLS + HTTP redirect |

## Deployment Architecture

```
Git Push
   ↓
Local Build (npm run build)
   ↓
rsync dist/ → /opt/jarvis/jarvis-gateway/static/
   ↓
systemctl restart jarvis-gateway
   ↓
VERIFY: curl -I https://on-za-menya.online/
```

## Detailed Docs

- **SOLID Refactoring Plan**: `.claude/plans/calm-painting-spring.md`
- **Architecture**: This file (CLAUDE.md)

## Best Practices

1. **Используй facade hooks** вместо прямого import stores
2. **Context Providers** обернуты в App.tsx (DI готов)
3. **Form hooks** для всех модальных окон (DRY)
4. **useFormValidation** для schema-based валидации
5. **useFormSubmission** для mutation + toast + query invalidation
6. **TypeScript strict** — NO `any` без веской причины
7. **Tailwind utility classes** — NO inline styles

---

**NO "готово" без деплоя и проверки на сервере!**
**SOLID REFACTORING COMPLETED — 6/6 phases done ✓**
