// Workflow API Interface
import type { Workflow, WorkflowRun, ConfigRecord } from '../types';

export interface IWorkflowAPI {
  createWorkflow(workflow: Omit<Workflow, 'id' | 'created_at'>): Promise<Workflow>;
  listWorkflows(userId?: string): Promise<Workflow[]>;
  getWorkflow(id: string): Promise<Workflow>;
  updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow>;
  deleteWorkflow(id: string): Promise<void>;
  runWorkflow(id: string, variables?: ConfigRecord): Promise<WorkflowRun>;
  getWorkflowRuns(workflowId: string): Promise<WorkflowRun[]>;
  getWorkflowRun(runId: string): Promise<WorkflowRun>;
  cancelWorkflowRun(runId: string): Promise<void>;
}
