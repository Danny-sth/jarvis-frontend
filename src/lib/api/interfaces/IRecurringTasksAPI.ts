// Recurring Tasks API Interface
import type { RecurringTask } from '../types';

export interface IRecurringTasksAPI {
  create(task: Omit<RecurringTask, 'id' | 'created_at'>): Promise<RecurringTask>;
  list(userId?: string): Promise<RecurringTask[]>;
  getById(taskId: string): Promise<RecurringTask>;
  update(taskId: string, task: Partial<RecurringTask>): Promise<RecurringTask>;
  deleteById(taskId: string): Promise<void>;
  previewCron(cron: string, timezone: string, count?: number): Promise<string[]>;
}
