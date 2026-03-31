// Jarvis API Client - ALL 44 endpoints

// ============================================================================
// TYPES
// ============================================================================

export interface QueueTask {
  task_id: string;
  status: 'pending' | 'queued' | 'running' | 'completed' | 'failed';
  priority: number;
  user_id: string;
  created_at: string;
  updated_at?: string;
  result?: any;
  error?: string;
}

export interface QueueStats {
  total: number;
  pending: number;
  queued: number;
  running: number;
  completed: number;
  failed: number;
}

export interface HeartbeatConfig {
  enabled: boolean;
  interval_minutes: number;
  active_hours_start: number;
  active_hours_end: number;
  timezone: string;
  checks: string[];
  check_configs: Record<string, any>;
}

export interface HeartbeatResult {
  timestamp: string;
  checks: Record<string, any>;
  summary: string;
}

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  steps: any[];
  created_at: string;
  updated_at?: string;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  result?: any;
  error?: string;
}

export interface RecurringTask {
  id: string;
  user_id: string;
  name: string;
  cron_expression: string;
  task_type: string;
  task_params: Record<string, any>;
  timezone: string;
  enabled: boolean;
  created_at: string;
  next_run?: string;
}

export interface MemoryResult {
  content: string;
  importance: number;
  timestamp: string;
  user_id: string;
  distance?: number;
}

export interface SystemInfo {
  version: string;
  uptime: number;
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
}

export interface ActivityEvent {
  type: string;
  data: any;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
  telegram_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface DocFile {
  name: string;  // Filename with extension
  path: string;  // Web path for routing (e.g., "/docs/api")
  title: string; // Display title
}

export interface DocCategory {
  category: string; // Category name (e.g., "API", "Services")
  files: DocFile[]; // Files in this category
}

export interface LiveMetrics {
  llm: {
    total_calls: number;
    total_cost_usd: number;
    calls_by_caller: Record<string, { count: number; cost: number }>;
  };
  api: {
    total_requests: number;
  };
  workers: {
    queue_depth: { pending: number; session: number; global: number };
  };
  tools: {
    total_executions: number;
  };
  timestamp: string;
}

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
  metadata?: Record<string, any>;
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

// ============================================================================
// API CLIENT
// ============================================================================

class JarvisAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('jarvis_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('jarvis_token', token);
    } else {
      localStorage.removeItem('jarvis_token');
    }
  }

  /**
   * Get current user's ID from localStorage (set during login)
   * @returns user_id as string, or empty string if not found
   */
  private getCurrentUserId(): string {
    return localStorage.getItem('jarvis_user_id') || '';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Clear auth state
      localStorage.removeItem('jarvis_token');
      localStorage.removeItem('jarvis_user_id');
      localStorage.removeItem('jarvis_username');
      localStorage.removeItem('jarvis_role');
      this.token = null;

      // Redirect to login
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // ============================================================================
  // AUTH
  // ============================================================================

  async login(username: string, password: string): Promise<{ token: string; user_id: number; role: string }> {
    const response = await this.request<{ token: string; user_id: number; role: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(response.token);
    return response;
  }

  logout() {
    this.setToken(null);
  }

  // ============================================================================
  // CHAT (3 endpoints)
  // ============================================================================

  async sendChat(message: string, userId: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, user_id: userId }),
    });
  }

  streamChat(message: string, userId: string, onChunk: (chunk: string) => void): EventSource {
    const url = new URL(`${this.baseUrl}/api/chat/stream`);
    url.searchParams.set('message', message);
    url.searchParams.set('user_id', userId);

    const eventSource = new EventSource(url.toString());
    eventSource.onmessage = (event) => {
      onChunk(event.data);
    };
    return eventSource;
  }

  async clearChatHistory(userId: string): Promise<void> {
    await this.request<void>(`/chat/clear?user_id=${userId}`, {
      method: 'POST',
    });
  }

  // ============================================================================
  // QUEUE (4 endpoints)
  // ============================================================================

  async getQueueStats(): Promise<QueueStats> {
    return this.request<QueueStats>('/queue/stats/overview');
  }

  async getQueueTasks(status?: string): Promise<QueueTask[]> {
    const url = status ? `/queue?status=${status}` : '/queue';
    return this.request<QueueTask[]>(url);
  }

  async getTask(taskId: string): Promise<QueueTask> {
    return this.request<QueueTask>(`/queue/${taskId}`);
  }

  async cancelTask(taskId: string): Promise<void> {
    await this.request<void>(`/queue/${taskId}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // CORTEX / MEMORY (2 endpoints)
  // ============================================================================

  async searchMemory(
    query: string,
    userId: string,
    limit = 10
  ): Promise<MemoryResult[]> {
    return this.request<MemoryResult[]>('/cortex/search', {
      method: 'POST',
      body: JSON.stringify({ query, user_id: userId, limit }),
    });
  }

  async storeMemory(
    content: string,
    userId: string,
    importance = 5
  ): Promise<void> {
    await this.request<void>('/cortex/store', {
      method: 'POST',
      body: JSON.stringify({ content, user_id: userId, importance }),
    });
  }

  // ============================================================================
  // OBSIDIAN (6 endpoints)
  // ============================================================================

  async listObsidianFiles(path = ''): Promise<string[]> {
    return this.request<string[]>(`/obsidian/list?path=${encodeURIComponent(path)}`);
  }

  async readObsidianFile(path: string): Promise<{ content: string }> {
    return this.request<{ content: string }>(`/obsidian/read?path=${encodeURIComponent(path)}`);
  }

  async writeObsidianFile(path: string, content: string): Promise<void> {
    await this.request<void>('/obsidian/write', {
      method: 'POST',
      body: JSON.stringify({ path, content }),
    });
  }

  async searchObsidian(query: string): Promise<any[]> {
    return this.request<any[]>(`/obsidian/search?query=${encodeURIComponent(query)}`);
  }

  async getObsidianLinks(path: string): Promise<string[]> {
    return this.request<string[]>(`/obsidian/links?path=${encodeURIComponent(path)}`);
  }

  async getObsidianBacklinks(path: string): Promise<string[]> {
    return this.request<string[]>(`/obsidian/backlinks?path=${encodeURIComponent(path)}`);
  }

  // ============================================================================
  // HEARTBEAT (4 endpoints)
  // ============================================================================

  async getHeartbeatConfig(userId?: string): Promise<HeartbeatConfig> {
    const uid = userId || this.getCurrentUserId();
    return this.request<HeartbeatConfig>(`/heartbeat/config?user_id=${uid}`);
  }

  async updateHeartbeatConfig(config: HeartbeatConfig, userId?: string): Promise<void> {
    const uid = userId || this.getCurrentUserId();
    await this.request<void>(`/heartbeat/config?user_id=${uid}`, {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async runHeartbeat(userId?: string): Promise<HeartbeatResult> {
    const uid = userId || this.getCurrentUserId();
    return this.request<HeartbeatResult>(`/heartbeat/run?user_id=${uid}`, {
      method: 'POST',
    });
  }

  async getAvailableChecks(): Promise<string[]> {
    return this.request<string[]>('/heartbeat/checks');
  }

  // ============================================================================
  // WORKFLOWS (9 endpoints)
  // ============================================================================

  async createWorkflow(workflow: Omit<Workflow, 'id' | 'created_at'>): Promise<Workflow> {
    return this.request<Workflow>('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflow),
    });
  }

  async listWorkflows(userId?: string): Promise<Workflow[]> {
    const uid = userId || this.getCurrentUserId();
    return this.request<Workflow[]>(`/workflows?user_id=${uid}`);
  }

  async getWorkflow(id: string): Promise<Workflow> {
    return this.request<Workflow>(`/workflows/${id}`);
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    return this.request<Workflow>(`/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workflow),
    });
  }

  async deleteWorkflow(id: string): Promise<void> {
    await this.request<void>(`/workflows/${id}`, {
      method: 'DELETE',
    });
  }

  async runWorkflow(id: string, variables?: Record<string, any>): Promise<WorkflowRun> {
    return this.request<WorkflowRun>(`/workflows/${id}/run`, {
      method: 'POST',
      body: JSON.stringify({ variables }),
    });
  }

  async getWorkflowRuns(workflowId: string): Promise<WorkflowRun[]> {
    return this.request<WorkflowRun[]>(`/workflows/${workflowId}/runs`);
  }

  async getWorkflowRun(runId: string): Promise<WorkflowRun> {
    return this.request<WorkflowRun>(`/workflows/runs/${runId}`);
  }

  async cancelWorkflowRun(runId: string): Promise<void> {
    await this.request<void>(`/workflows/runs/${runId}/cancel`, {
      method: 'POST',
    });
  }

  // ============================================================================
  // REFLECTION (2 endpoints)
  // ============================================================================

  async getLearnings(limit = 20, userId?: string): Promise<any[]> {
    const uid = userId || this.getCurrentUserId();
    return this.request<any[]>(`/reflection/learnings?user_id=${uid}&limit=${limit}`);
  }

  async runReflection(userId?: string): Promise<any> {
    const uid = userId || this.getCurrentUserId();
    return this.request<any>(`/reflection/run?user_id=${uid}`, {
      method: 'POST',
    });
  }

  // ============================================================================
  // RECURRING TASKS (5 endpoints)
  // ============================================================================

  async createRecurring(task: Omit<RecurringTask, 'id' | 'created_at'>): Promise<RecurringTask> {
    return this.request<RecurringTask>('/recurring', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async listRecurring(userId?: string): Promise<RecurringTask[]> {
    const uid = userId || this.getCurrentUserId();
    return this.request<RecurringTask[]>(`/recurring?user_id=${uid}`);
  }

  async getRecurring(taskId: string): Promise<RecurringTask> {
    return this.request<RecurringTask>(`/recurring/${taskId}`);
  }

  async updateRecurring(taskId: string, task: Partial<RecurringTask>): Promise<RecurringTask> {
    return this.request<RecurringTask>(`/recurring/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteRecurring(taskId: string): Promise<void> {
    await this.request<void>(`/recurring/${taskId}`, {
      method: 'DELETE',
    });
  }

  async previewCron(cron: string, timezone: string, count = 5): Promise<string[]> {
    return this.request<string[]>('/recurring/preview', {
      method: 'POST',
      body: JSON.stringify({ cron_expression: cron, timezone, count }),
    });
  }

  // ============================================================================
  // SUBTASKS (5 endpoints)
  // ============================================================================

  async spawnSubtask(parentId: string, task: any): Promise<QueueTask> {
    return this.request<QueueTask>('/subtasks/spawn', {
      method: 'POST',
      body: JSON.stringify({ parent_id: parentId, ...task }),
    });
  }

  async getSubtasks(parentId: string): Promise<QueueTask[]> {
    return this.request<QueueTask[]>(`/subtasks/${parentId}`);
  }

  async aggregateSubtaskResults(parentId: string): Promise<any> {
    return this.request<any>(`/subtasks/${parentId}/aggregate`);
  }

  async waitForSubtasks(parentId: string, timeout = 300): Promise<any> {
    return this.request<any>(`/subtasks/${parentId}/wait?timeout=${timeout}`);
  }

  async cancelAllSubtasks(parentId: string): Promise<void> {
    await this.request<void>(`/subtasks/${parentId}/cancel`, {
      method: 'POST',
    });
  }

  // ============================================================================
  // ACTIVITY (1 endpoint - SSE)
  // ============================================================================

  streamActivity(onEvent: (event: ActivityEvent) => void): EventSource {
    const eventSource = new EventSource(`${this.baseUrl}/api/activity/stream`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent(data);
      } catch (e) {
        console.error('Failed to parse activity event:', e);
      }
    };
    return eventSource;
  }

  // ============================================================================
  // SYSTEM (2 endpoints)
  // ============================================================================

  async getVersion(): Promise<{ version: string }> {
    return this.request<{ version: string }>('/system/version');
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return this.request<SystemInfo>('/system/info');
  }

  // ============================================================================
  // USER MANAGEMENT (4 endpoints)
  // ============================================================================

  async listUsers(search?: string, role?: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (role) params.set('role', role);
    const queryString = params.toString();
    return this.request<User[]>(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async createUser(user: {
    username: string;
    password: string;
    role: string;
    telegram_id?: number | null;
    is_active: boolean;
  }): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(
    id: number,
    updates: {
      username?: string;
      password?: string;
      role?: string;
      telegram_id?: number | null;
      is_active?: boolean;
    }
  ): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // DOCUMENTATION (1 endpoint)
  // ============================================================================

  async listDocs(): Promise<DocCategory[]> {
    return this.request<DocCategory[]>('/docs/list');
  }

  // ============================================================================
  // MONITORING (4 endpoints)
  // ============================================================================

  async getLiveMetrics(): Promise<LiveMetrics> {
    return this.request<LiveMetrics>('/monitoring/metrics/live');
  }

  async getMonitoringEvents(params?: {
    event_type?: string;
    status?: string;
    user_id?: string;
    request_id?: string;
    time_range?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ total: number; limit: number; offset: number; events: MonitoringEvent[] }> {
    const query = new URLSearchParams();
    if (params?.event_type) query.set('event_type', params.event_type);
    if (params?.status) query.set('status', params.status);
    if (params?.user_id) query.set('user_id', params.user_id);
    if (params?.request_id) query.set('request_id', params.request_id);
    if (params?.time_range) query.set('time_range', params.time_range);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());

    const queryString = query.toString();
    return this.request(`/monitoring/events${queryString ? `?${queryString}` : ''}`);
  }

  async getLLMUsage(params?: {
    period?: string;
    caller?: string;
  }): Promise<LLMUsageSummary> {
    const query = new URLSearchParams();
    if (params?.period) query.set('period', params.period);
    if (params?.caller) query.set('caller', params.caller);

    const queryString = query.toString();
    return this.request(`/monitoring/llm/usage${queryString ? `?${queryString}` : ''}`);
  }

  async getStatsSummary(period?: string): Promise<StatsSummary> {
    const query = period ? `?period=${period}` : '';
    return this.request(`/monitoring/stats/summary${query}`);
  }
}

export const api = new JarvisAPI();
