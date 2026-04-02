// Subtasks API Interface
import type { QueueTask, SubtaskPayload, SubtaskAggregateResult } from '../types';

export interface ISubtasksAPI {
  spawn(parentId: string, task: SubtaskPayload): Promise<QueueTask>;
  getSubtasks(parentId: string): Promise<QueueTask[]>;
  aggregate(parentId: string): Promise<SubtaskAggregateResult>;
  wait(parentId: string, timeout?: number): Promise<SubtaskAggregateResult>;
  cancelAll(parentId: string): Promise<void>;
}
