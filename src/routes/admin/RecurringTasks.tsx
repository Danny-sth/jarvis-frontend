import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Clock } from 'lucide-react';
import { api } from '../../lib/api-client';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth';
import { formatDate } from '../../lib/utils';
import { CreateRecurringTaskModal } from '../../components/modals/CreateRecurringTaskModal';

export default function RecurringTasks() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { userId } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['recurring-tasks', userId],
    queryFn: () => api.listRecurring(userId!),
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteRecurring(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-tasks', userId] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-jarvis-cyan mb-2">RECURRING TASKS</h1>
          <p className="text-jarvis-text-secondary font-body">
            Schedule tasks with cron expressions
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          NEW TASK
        </Button>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <Card>
          <p className="text-jarvis-text-muted font-body text-center">Loading tasks...</p>
        </Card>
      ) : tasks && tasks.length > 0 ? (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-display text-jarvis-cyan">
                      {task.name}
                    </h3>
                    {!task.enabled && (
                      <span className="text-xs font-body text-jarvis-text-muted px-2 py-1 bg-jarvis-bg-dark rounded">
                        DISABLED
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-jarvis-purple" />
                      <code className="font-mono text-jarvis-purple">
                        {task.cron_expression}
                      </code>
                      <span className="text-jarvis-text-muted font-body">
                        ({task.timezone})
                      </span>
                    </div>
                    {task.next_run && (
                      <p className="text-sm text-jarvis-text-secondary font-body">
                        Next run: {formatDate(task.next_run)}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteMutation.mutate(task.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <p className="text-jarvis-text-muted font-body mb-4">No recurring tasks yet</p>
            <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              CREATE FIRST TASK
            </Button>
          </div>
        </Card>
      )}

      <CreateRecurringTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
