import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, RefreshCw } from 'lucide-react';
import { useQueueAPI } from '../../contexts/APIContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatDate, formatRelativeTime } from '../../lib/utils';

export default function QueueMonitor() {
  const queueAPI = useQueueAPI();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['queue-tasks'],
    queryFn: () => queueAPI.getQueueTasks(),
    refetchInterval: 3000,
  });

  const cancelMutation = useMutation({
    mutationFn: (taskId: string) => queueAPI.cancelTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue-tasks'] });
    },
  });

  const statusColors: Record<string, string> = {
    pending: 'text-jarvis-text-muted',
    queued: 'text-blue-400',
    running: 'text-jarvis-purple',
    completed: 'text-green-500',
    failed: 'text-jarvis-orange',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-jarvis-cyan mb-2">QUEUE MONITOR</h1>
          <p className="text-jarvis-text-secondary font-body">
            Real-time task queue status
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['queue-tasks'] })}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          REFRESH
        </Button>
      </div>

      {/* Tasks Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-jarvis-cyan/20 bg-jarvis-bg-card">
                <th className="px-6 py-4 text-left text-sm font-display text-jarvis-cyan">
                  TASK ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-display text-jarvis-cyan">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left text-sm font-display text-jarvis-cyan">
                  PRIORITY
                </th>
                <th className="px-6 py-4 text-left text-sm font-display text-jarvis-cyan">
                  CREATED
                </th>
                <th className="px-6 py-4 text-left text-sm font-display text-jarvis-cyan">
                  USER
                </th>
                <th className="px-6 py-4 text-right text-sm font-display text-jarvis-cyan">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-jarvis-text-muted font-body">
                    Loading tasks...
                  </td>
                </tr>
              ) : tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr
                    key={task.task_id}
                    className="border-b border-jarvis-cyan/10 hover:bg-jarvis-bg-card transition-colors"
                  >
                    <td className="px-6 py-4">
                      <code className="text-sm font-mono text-jarvis-cyan">
                        {task.task_id.slice(0, 8)}...
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-body font-semibold uppercase ${
                          statusColors[task.status]
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-jarvis-text-primary">
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-sm font-body text-jarvis-text-secondary"
                        title={formatDate(task.created_at)}
                      >
                        {formatRelativeTime(task.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-jarvis-text-secondary">
                        {task.user_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(task.status === 'pending' ||
                        task.status === 'queued' ||
                        task.status === 'running') && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => cancelMutation.mutate(task.task_id)}
                          disabled={cancelMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-jarvis-text-muted font-body">
                    No tasks in queue
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
