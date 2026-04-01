/**
 * Application Constants
 * Centralized configuration values for the jarvis-frontend application
 */

// =============================================================================
// TIMING & INTERVALS
// =============================================================================

export const REFETCH_INTERVALS = {
  /** Fast refresh for real-time data (3s) */
  FAST: 3000,
  /** Normal refresh for dashboard stats (5s) */
  NORMAL: 5000,
  /** System info refresh (10s) */
  SYSTEM: 10000,
  /** Slow refresh for event feeds (15s) */
  SLOW: 15000,
  /** Lazy refresh for summaries (30s) */
  LAZY: 30000,
  /** Chart data refresh (5 min) */
  CHART: 300000,
} as const;

export const TIMEOUTS = {
  /** Toast auto-dismiss (3s) */
  TOAST: 3000,
  /** Debounce delay for search (300ms) */
  DEBOUNCE: 300,
  /** Animation delay multiplier */
  STAGGER: 0.1,
} as const;

// =============================================================================
// VALIDATION RULES
// =============================================================================

export const VALIDATION = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_WORKFLOW_NAME_LENGTH: 3,
  MAX_WORKFLOW_NAME_LENGTH: 100,
  MIN_TASK_NAME_LENGTH: 3,
  MAX_MEMORY_CONTENT_LENGTH: 10000,
} as const;

// =============================================================================
// QUERY KEYS
// =============================================================================

export const QUERY_KEYS = {
  // Queue
  QUEUE_STATS: 'queue-stats',
  QUEUE_TASKS: 'queue-tasks',

  // System
  SYSTEM_INFO: 'system-info',
  SYSTEM_VERSION: 'system-version',

  // Monitoring
  LIVE_METRICS: 'live-metrics',
  STATS_SUMMARY: 'stats-summary',
  MONITORING_EVENTS: 'monitoring-events',
  LLM_USAGE: 'llm-usage-7d',

  // Workflows
  WORKFLOWS: 'workflows',
  WORKFLOW_RUNS: 'workflow-runs',

  // Recurring Tasks
  RECURRING_TASKS: 'recurring-tasks',
  CRON_PREVIEW: 'cron-preview',

  // Memory
  MEMORY_SEARCH: 'memory-search',

  // Heartbeat
  HEARTBEAT_CONFIG: 'heartbeat-config',

  // Users
  USERS: 'users',

  // Docs
  DOCS_LIST: 'docs-list',
  DOC_CONTENT: 'doc-content',
} as const;

// =============================================================================
// STATUS & COLORS
// =============================================================================

export const TASK_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  running: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  timeout: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
} as const;

export const EVENT_TYPE_COLORS = {
  api_request: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  tool_execution: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  worker_task: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  external_service: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
} as const;

// =============================================================================
// USER ROLES
// =============================================================================

export const USER_ROLES = [
  { value: 'root', label: 'Root (Admin)' },
  { value: 'admin', label: 'Admin' },
  { value: 'public', label: 'Public (User)' },
] as const;

export const ROLE_BADGE_VARIANTS = {
  root: 'error',
  admin: 'warning',
  public: 'default',
} as const;

// =============================================================================
// HEARTBEAT CHECKS
// =============================================================================

export const AVAILABLE_CHECKS = [
  { value: 'gmail', label: 'Gmail' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'system', label: 'System' },
] as const;

export const DEFAULT_HEARTBEAT_CONFIG = {
  checkIntervalMinutes: 60,
  activeHoursStart: 9,
  activeHoursEnd: 22,
  defaultChecks: ['gmail', 'calendar'],
} as const;

// =============================================================================
// TIMEZONES
// =============================================================================

export const TIMEZONES = [
  { value: 'Europe/Moscow', label: 'Moscow (UTC+3)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
] as const;

// =============================================================================
// RECURRING TASK TYPES
// =============================================================================

export const TASK_TYPES = [
  { value: 'message', label: 'Message' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'email', label: 'Email' },
  { value: 'workflow', label: 'Run Workflow' },
] as const;

// =============================================================================
// PAGINATION
// =============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// =============================================================================
// APP INFO
// =============================================================================

export const APP_INFO = {
  NAME: 'JARVIS',
  FULL_NAME: 'Not That Jarvis',
  VERSION: '2.0.0',
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];
export type UserRole = typeof USER_ROLES[number]['value'];
export type CheckType = typeof AVAILABLE_CHECKS[number]['value'];
export type TaskType = typeof TASK_TYPES[number]['value'];
export type Timezone = typeof TIMEZONES[number]['value'];
