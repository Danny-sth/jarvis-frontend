// Shared types for API layer
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type ConfigRecord = Record<string, JsonValue>;

// Workflow types
export interface WorkflowStep {
  id: string;
  action_type: string;
  params: ConfigRecord;
  next_step_id?: string;
  on_error?: string;
}

export interface WorkflowResult {
  success: boolean;
  output?: ConfigRecord;
  steps_executed?: number;
  error?: string;
}

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  created_at: string;
  updated_at?: string;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  result?: WorkflowResult;
  error?: string;
}

// Task types
export interface TaskResult {
  success: boolean;
  output?: ConfigRecord;
  duration_ms?: number;
  error?: string;
}

export interface QueueTask {
  task_id: string;
  status: 'pending' | 'queued' | 'running' | 'completed' | 'failed';
  priority: number;
  user_id: string;
  created_at: string;
  updated_at?: string;
  result?: TaskResult;
  error?: string;
}

export interface QueueStats {
  total: number;
  pending: number;
  queued: number;
  running: number;
  completed: number;
  failed: number;
  scheduled: number;
  cancelled: number;
}

export interface SubtaskPayload {
  name: string;
  params: ConfigRecord;
  priority?: number;
}

export interface SubtaskAggregateResult {
  parent_id: string;
  total: number;
  completed: number;
  failed: number;
  results: TaskResult[];
}

// Heartbeat types
export interface HeartbeatConfig {
  enabled: boolean;
  interval_minutes: number;
  active_hours_start: number;
  active_hours_end: number;
  timezone: string;
  checks: string[];
  check_configs: ConfigRecord;
}

export interface HeartbeatResult {
  timestamp: string;
  checks: Record<string, { status: string; message?: string; data?: ConfigRecord }>;
  summary: string;
}

// Recurring task types
export interface RecurringTask {
  id: string;
  user_id: string;
  name: string;
  cron_expression: string;
  task_type: string;
  task_params: ConfigRecord;
  timezone: string;
  enabled: boolean;
  created_at: string;
  next_run?: string;
}

// Memory/Cortex types
export interface MemoryResult {
  content: string;
  importance: number;
  timestamp: string;
  user_id: string;
  distance?: number;
}

// Obsidian types
export interface ObsidianSearchResult {
  path: string;
  title: string;
  content: string;
  score: number;
}

// Reflection types
export interface Learning {
  id: string;
  content: string;
  source: string;
  importance: number;
  created_at: string;
}

export interface ReflectionResult {
  summary: string;
  insights: string[];
  learnings_count: number;
}

// System types
export interface SystemInfo {
  version: string;
  uptime: number;
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
}

// Activity types
export interface ActivityEventData {
  endpoint?: string;
  method?: string;
  status_code?: number;
  duration_ms?: number;
  tool_name?: string;
  caller?: string;
  [key: string]: JsonValue | undefined;
}

export interface ActivityEvent {
  type: string;
  data: ActivityEventData;
  timestamp: string;
}

// Chat types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

// User types
export interface User {
  id: number;
  username: string;
  role: string;
  telegram_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: string;
  telegram_id?: number | null;
  is_active: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
  role?: string;
  telegram_id?: number | null;
  is_active?: boolean;
}

// Documentation types
export interface DocFile {
  name: string;
  path: string;
  title: string;
}

export interface DocCategory {
  category: string;
  files: DocFile[];
}

// Monitoring types
export interface MonitoringEvent {
  id: number;
  created_at: string;
  event_type: 'api_request' | 'tool_execution' | 'worker_task' | 'external_service';
  name: string;
  status: 'success' | 'error' | 'timeout';
  duration_ms: number;
  user_id?: string;
  request_id?: string;
  error_message?: string;
  metadata?: ConfigRecord;
}

export interface LLMUsageSummary {
  period: string;
  summary: {
    total_calls: number;
    total_cost_usd: number;
    by_caller: Record<string, {
      calls: number;
      input_tokens: number;
      output_tokens: number;
      cache_read_tokens: number;
      cache_creation_tokens: number;
      cost_usd: number;
      estimated: boolean;
    }>;
  };
}

export interface StatsSummary {
  period: string;
  time_range: string;
  api: {
    total_requests: number;
    error_rate: number;
    avg_duration_ms: number;
    p95_duration_ms: number;
  };
  llm: {
    total_calls: number;
    total_cost_usd: number;
    avg_tokens_per_call: number;
  };
  workers: {
    processed_tasks: number;
    failed_tasks: number;
    avg_duration_ms: number;
  };
  tools: {
    total_executions: number;
    failed_executions: number;
  };
}
