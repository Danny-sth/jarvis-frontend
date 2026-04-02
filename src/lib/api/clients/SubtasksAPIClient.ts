// Subtasks API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { ISubtasksAPI } from '../interfaces/ISubtasksAPI';
import type { QueueTask, SubtaskPayload, SubtaskAggregateResult } from '../types';

export class SubtasksAPIClient extends BaseAPIClient implements ISubtasksAPI {
  async spawn(parentId: string, task: SubtaskPayload): Promise<QueueTask> {
    return this.post<QueueTask>('/subtasks/spawn', {
      parent_id: parentId,
      ...task,
    });
  }

  async getSubtasks(parentId: string): Promise<QueueTask[]> {
    return this.get<QueueTask[]>(`/subtasks/${parentId}`);
  }

  async aggregate(parentId: string): Promise<SubtaskAggregateResult> {
    return this.get<SubtaskAggregateResult>(`/subtasks/${parentId}/aggregate`);
  }

  async wait(parentId: string, timeout = 300): Promise<SubtaskAggregateResult> {
    return this.get<SubtaskAggregateResult>(`/subtasks/${parentId}/wait?timeout=${timeout}`);
  }

  async cancelAll(parentId: string): Promise<void> {
    await this.post<void>(`/subtasks/${parentId}/cancel`);
  }
}
