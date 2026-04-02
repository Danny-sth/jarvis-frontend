import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Play, Trash2 } from 'lucide-react';
import { useWorkflowAPI } from '../../hooks/useAPI';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../lib/utils';
import { CreateWorkflowModal } from '../../components/modals/CreateWorkflowModal';

export default function WorkflowEditor() {
  const workflowAPI = useWorkflowAPI();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows', userId],
    queryFn: () => workflowAPI.listWorkflows(userId!),
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => workflowAPI.deleteWorkflow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows', userId] });
    },
  });

  const runMutation = useMutation({
    mutationFn: (id: string) => workflowAPI.runWorkflow(id),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-jarvis-cyan mb-2">WORKFLOWS</h1>
          <p className="text-jarvis-text-secondary font-body">
            Create and manage automated workflows
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          NEW WORKFLOW
        </Button>
      </div>

      {/* Workflows List */}
      {isLoading ? (
        <Card>
          <p className="text-jarvis-text-muted font-body text-center">Loading workflows...</p>
        </Card>
      ) : workflows && workflows.length > 0 ? (
        <div className="grid gap-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-display text-jarvis-cyan mb-2">
                    {workflow.name}
                  </h3>
                  {workflow.description && (
                    <p className="text-sm text-jarvis-text-secondary font-body mb-3">
                      {workflow.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-jarvis-text-muted font-mono">
                    <span>ID: {workflow.id.slice(0, 8)}</span>
                    <span>Steps: {workflow.steps.length}</span>
                    <span>Created: {formatDate(workflow.created_at)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => runMutation.mutate(workflow.id)}
                    disabled={runMutation.isPending}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteMutation.mutate(workflow.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <p className="text-jarvis-text-muted font-body mb-4">No workflows yet</p>
            <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              CREATE FIRST WORKFLOW
            </Button>
          </div>
        </Card>
      )}

      <CreateWorkflowModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
