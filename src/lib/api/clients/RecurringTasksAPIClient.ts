// Recurring Tasks API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IRecurringTasksAPI } from '../interfaces/IRecurringTasksAPI';
import type { RecurringTask } from '../types';

export class RecurringTasksAPIClient extends BaseAPIClient implements IRecurringTasksAPI {
  async create(task: Omit<RecurringTask, 'id' | 'created_at'>): Promise<RecurringTask> {
    return this.post<RecurringTask>('/recurring', task);
  }

  async list(userId?: string): Promise<RecurringTask[]> {
    const uid = userId || this.getCurrentUserId();
    return super.get<RecurringTask[]>(`/recurring?user_id=${uid}`);
  }

  async getById(taskId: string): Promise<RecurringTask> {
    return super.get<RecurringTask>(`/recurring/${taskId}`);
  }

  async update(taskId: string, task: Partial<RecurringTask>): Promise<RecurringTask> {
    return this.put<RecurringTask>(`/recurring/${taskId}`, task);
  }

  async deleteById(taskId: string): Promise<void> {
    await super.delete<void>(`/recurring/${taskId}`);
  }

  async previewCron(cron: string, timezone: string, count = 5): Promise<string[]> {
    return this.post<string[]>('/recurring/preview', {
      cron_expression: cron,
      timezone,
      count,
    });
  }
}
