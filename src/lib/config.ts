/**
 * Application Configuration
 *
 * Centralizes all environment-dependent settings and constants.
 * DO NOT hardcode URLs, ports, or environment-specific values in code.
 */

// API Configuration
export const API_CONFIG = {
  // Backend API port
  BACKEND_PORT: import.meta.env.VITE_BACKEND_PORT || '8081',

  // Gateway API port
  GATEWAY_PORT: import.meta.env.VITE_GATEWAY_PORT || '8082',

  // Base URLs (constructed from current location)
  get BACKEND_URL(): string {
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    return `${protocol}//${window.location.hostname}:${this.BACKEND_PORT}`;
  },

  get GATEWAY_URL(): string {
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    return `${protocol}//${window.location.hostname}:${this.GATEWAY_PORT}`;
  },

  // WebSocket Configuration
  get WS_PROTOCOL(): string {
    return window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  },

  get WS_HOSTNAME(): string {
    return window.location.hostname;
  },

  // WebSocket URLs
  get SYSTEM_METRICS_WS_URL(): string {
    return `${this.WS_PROTOCOL}//${this.WS_HOSTNAME}:${this.BACKEND_PORT}/api/ws/system/metrics`;
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'jarvis_token',
  USER_ID: 'jarvis_user_id',
  USERNAME: 'jarvis_username',
  ROLE: 'jarvis_role',
} as const;

// UI Configuration
export const UI_CONFIG = {
  // Toast timeout
  TOAST_TIMEOUT: 3000,

  // WebSocket reconnect delay
  WS_RECONNECT_DELAY: 3000,

  // Animation timings
  ANIMATION: {
    EYE_GAP: 120,
    EYE_Y_POSITION: 80,
  },
} as const;

// Routes
export const ROUTES = {
  LOGIN: '/login',
  ADMIN: '/admin',
  DOCS: '/docs',
} as const;

// React Query Configuration
export const QUERY_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  REFETCH_ON_WINDOW_FOCUS: false,
} as const;
