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

// ============================================================================
// API CLIENT
// ============================================================================

class JarvisAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl = 'http://90.156.230.49:8082') {
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

  async login(username: string, password: string): Promise<{ token: string }> {
    const response = await this.request<{ token: string }>('/api/auth/login', {
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
    return this.request<ChatResponse>('/api/chat', {
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
    await this.request<void>(`/api/chat/clear?user_id=${userId}`, {
      method: 'POST',
    });
  }

  // ============================================================================
  // QUEUE (4 endpoints)
  // ============================================================================

  async getQueueStats(): Promise<QueueStats> {
    return this.request<QueueStats>('/api/queue/stats/overview');
  }

  async getQueueTasks(status?: string): Promise<QueueTask[]> {
    const url = status ? `/api/queue?status=${status}` : '/api/queue';
    return this.request<QueueTask[]>(url);
  }

  async getTask(taskId: string): Promise<QueueTask> {
    return this.request<QueueTask>(`/api/queue/${taskId}`);
  }

  async cancelTask(taskId: string): Promise<void> {
    await this.request<void>(`/api/queue/${taskId}`, {
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
    return this.request<MemoryResult[]>('/api/cortex/search', {
      method: 'POST',
      body: JSON.stringify({ query, user_id: userId, limit }),
    });
  }

  async storeMemory(
    content: string,
    userId: string,
    importance = 5
  ): Promise<void> {
    await this.request<void>('/api/cortex/store', {
      method: 'POST',
      body: JSON.stringify({ content, user_id: userId, importance }),
    });
  }

  // ============================================================================
  // OBSIDIAN (6 endpoints)
  // ============================================================================

  async listObsidianFiles(path = ''): Promise<string[]> {
    return this.request<string[]>(`/api/obsidian/list?path=${encodeURIComponent(path)}`);
  }

  async readObsidianFile(path: string): Promise<{ content: string }> {
    return this.request<{ content: string }>(`/api/obsidian/read?path=${encodeURIComponent(path)}`);
  }

  async writeObsidianFile(path: string, content: string): Promise<void> {
    await this.request<void>('/api/obsidian/write', {
      method: 'POST',
      body: JSON.stringify({ path, content }),
    });
  }

  async searchObsidian(query: string): Promise<any[]> {
    return this.request<any[]>(`/api/obsidian/search?query=${encodeURIComponent(query)}`);
  }

  async getObsidianLinks(path: string): Promise<string[]> {
    return this.request<string[]>(`/api/obsidian/links?path=${encodeURIComponent(path)}`);
  }

  async getObsidianBacklinks(path: string): Promise<string[]> {
    return this.request<string[]>(`/api/obsidian/backlinks?path=${encodeURIComponent(path)}`);
  }

  // ============================================================================
  // HEARTBEAT (4 endpoints)
  // ============================================================================

  async getHeartbeatConfig(userId: string): Promise<HeartbeatConfig> {
    return this.request<HeartbeatConfig>(`/api/heartbeat/config?user_id=${userId}`);
  }

  async updateHeartbeatConfig(userId: string, config: HeartbeatConfig): Promise<void> {
    await this.request<void>('/api/heartbeat/config', {
      method: 'PUT',
      body: JSON.stringify({ user_id: userId, ...config }),
    });
  }

  async runHeartbeat(userId: string): Promise<HeartbeatResult> {
    return this.request<HeartbeatResult>('/api/heartbeat/run', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async getAvailableChecks(): Promise<string[]> {
    return this.request<string[]>('/api/heartbeat/checks');
  }

  // ============================================================================
  // WORKFLOWS (9 endpoints)
  // ============================================================================

  async createWorkflow(workflow: Omit<Workflow, 'id' | 'created_at'>): Promise<Workflow> {
    return this.request<Workflow>('/api/workflows', {
      method: 'POST',
      body: JSON.stringify(workflow),
    });
  }

  async listWorkflows(userId: string): Promise<Workflow[]> {
    return this.request<Workflow[]>(`/api/workflows?user_id=${userId}`);
  }

  async getWorkflow(id: string): Promise<Workflow> {
    return this.request<Workflow>(`/api/workflows/${id}`);
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    return this.request<Workflow>(`/api/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workflow),
    });
  }

  async deleteWorkflow(id: string): Promise<void> {
    await this.request<void>(`/api/workflows/${id}`, {
      method: 'DELETE',
    });
  }

  async runWorkflow(id: string, variables?: Record<string, any>): Promise<WorkflowRun> {
    return this.request<WorkflowRun>(`/api/workflows/${id}/run`, {
      method: 'POST',
      body: JSON.stringify({ variables }),
    });
  }

  async getWorkflowRuns(workflowId: string): Promise<WorkflowRun[]> {
    return this.request<WorkflowRun[]>(`/api/workflows/${workflowId}/runs`);
  }

  async getWorkflowRun(runId: string): Promise<WorkflowRun> {
    return this.request<WorkflowRun>(`/api/workflows/runs/${runId}`);
  }

  async cancelWorkflowRun(runId: string): Promise<void> {
    await this.request<void>(`/api/workflows/runs/${runId}/cancel`, {
      method: 'POST',
    });
  }

  // ============================================================================
  // REFLECTION (2 endpoints)
  // ============================================================================

  async getLearnings(userId: string, limit = 20): Promise<any[]> {
    return this.request<any[]>(`/api/reflection/learnings?user_id=${userId}&limit=${limit}`);
  }

  async runReflection(userId: string): Promise<any> {
    return this.request<any>('/api/reflection/run', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // ============================================================================
  // RECURRING TASKS (5 endpoints)
  // ============================================================================

  async createRecurring(task: Omit<RecurringTask, 'id' | 'created_at'>): Promise<RecurringTask> {
    return this.request<RecurringTask>('/api/recurring', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async listRecurring(userId: string): Promise<RecurringTask[]> {
    return this.request<RecurringTask[]>(`/api/recurring?user_id=${userId}`);
  }

  async getRecurring(taskId: string): Promise<RecurringTask> {
    return this.request<RecurringTask>(`/api/recurring/${taskId}`);
  }

  async updateRecurring(taskId: string, task: Partial<RecurringTask>): Promise<RecurringTask> {
    return this.request<RecurringTask>(`/api/recurring/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteRecurring(taskId: string): Promise<void> {
    await this.request<void>(`/api/recurring/${taskId}`, {
      method: 'DELETE',
    });
  }

  async previewCron(cron: string, timezone: string, count = 5): Promise<string[]> {
    return this.request<string[]>('/api/recurring/preview', {
      method: 'POST',
      body: JSON.stringify({ cron_expression: cron, timezone, count }),
    });
  }

  // ============================================================================
  // SUBTASKS (5 endpoints)
  // ============================================================================

  async spawnSubtask(parentId: string, task: any): Promise<QueueTask> {
    return this.request<QueueTask>('/api/subtasks/spawn', {
      method: 'POST',
      body: JSON.stringify({ parent_id: parentId, ...task }),
    });
  }

  async getSubtasks(parentId: string): Promise<QueueTask[]> {
    return this.request<QueueTask[]>(`/api/subtasks/${parentId}`);
  }

  async aggregateSubtaskResults(parentId: string): Promise<any> {
    return this.request<any>(`/api/subtasks/${parentId}/aggregate`);
  }

  async waitForSubtasks(parentId: string, timeout = 300): Promise<any> {
    return this.request<any>(`/api/subtasks/${parentId}/wait?timeout=${timeout}`);
  }

  async cancelAllSubtasks(parentId: string): Promise<void> {
    await this.request<void>(`/api/subtasks/${parentId}/cancel`, {
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
    return this.request<{ version: string }>('/api/system/version');
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return this.request<SystemInfo>('/api/system/info');
  }
}

export const api = new JarvisAPI();
