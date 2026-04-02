// Workflow API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IWorkflowAPI } from '../interfaces/IWorkflowAPI';
import type { Workflow, WorkflowRun, ConfigRecord } from '../types';

export class WorkflowAPIClient extends BaseAPIClient implements IWorkflowAPI {
  async createWorkflow(workflow: Omit<Workflow, 'id' | 'created_at'>): Promise<Workflow> {
    return this.post<Workflow>('/workflows', workflow);
  }

  async listWorkflows(userId?: string): Promise<Workflow[]> {
    const uid = userId || this.getCurrentUserId();
    return this.get<Workflow[]>(`/workflows?user_id=${uid}`);
  }

  async getWorkflow(id: string): Promise<Workflow> {
    return this.get<Workflow>(`/workflows/${id}`);
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    return this.put<Workflow>(`/workflows/${id}`, workflow);
  }

  async deleteWorkflow(id: string): Promise<void> {
    await this.delete<void>(`/workflows/${id}`);
  }

  async runWorkflow(id: string, variables?: ConfigRecord): Promise<WorkflowRun> {
    return this.post<WorkflowRun>(`/workflows/${id}/run`, { variables });
  }

  async getWorkflowRuns(workflowId: string): Promise<WorkflowRun[]> {
    return this.get<WorkflowRun[]>(`/workflows/${workflowId}/runs`);
  }

  async getWorkflowRun(runId: string): Promise<WorkflowRun> {
    return this.get<WorkflowRun>(`/workflows/runs/${runId}`);
  }

  async cancelWorkflowRun(runId: string): Promise<void> {
    await this.post<void>(`/workflows/runs/${runId}/cancel`);
  }
}
