// Queue API Interface
import type { QueueStats, QueueTask } from '../types';

export interface IQueueAPI {
  getQueueStats(): Promise<QueueStats>;
  getQueueTasks(status?: string): Promise<QueueTask[]>;
  getTask(taskId: string): Promise<QueueTask>;
  cancelTask(taskId: string): Promise<void>;
}
