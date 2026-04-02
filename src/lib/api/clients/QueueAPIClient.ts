// Queue API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IQueueAPI } from '../interfaces/IQueueAPI';
import type { QueueStats, QueueTask } from '../types';

export class QueueAPIClient extends BaseAPIClient implements IQueueAPI {
  async getQueueStats(): Promise<QueueStats> {
    return this.get<QueueStats>('/queue/stats/overview');
  }

  async getQueueTasks(status?: string): Promise<QueueTask[]> {
    const url = status ? `/queue?status=${status}` : '/queue';
    return this.get<QueueTask[]>(url);
  }

  async getTask(taskId: string): Promise<QueueTask> {
    return this.get<QueueTask>(`/queue/${taskId}`);
  }

  async cancelTask(taskId: string): Promise<void> {
    await this.delete<void>(`/queue/${taskId}`);
  }
}
