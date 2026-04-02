import { useQuery } from '@tanstack/react-query';
import { Activity, ListTodo, CheckCircle2, XCircle } from 'lucide-react';
import { useQueueAPI } from '../../contexts/APIContext';
import { Card } from '../ui/Card';

export function QueueStatsCard() {
  const queueAPI = useQueueAPI();

  const { data: queueStats } = useQuery({
    queryKey: ['queue-stats'],
    queryFn: () => queueAPI.getQueueStats(),
    refetchInterval: 5000,
    placeholderData: (previousData) => previousData,
  });

  const stats = [
    {
      label: 'TOTAL TASKS',
      value: queueStats?.total ?? 0,
      icon: ListTodo,
      color: 'text-jarvis-cyan',
    },
    {
      label: 'RUNNING',
      value: queueStats?.running ?? 0,
      icon: Activity,
      color: 'text-jarvis-purple',
    },
    {
      label: 'COMPLETED',
      value: queueStats?.completed ?? 0,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      label: 'FAILED',
      value: queueStats?.failed ?? 0,
      icon: XCircle,
      color: 'text-jarvis-orange',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-body text-jarvis-text-muted mb-1">
                {stat.label}
              </p>
              <p className={`text-3xl font-display font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <stat.icon className={`w-10 h-10 ${stat.color} opacity-20`} />
          </div>
        </Card>
      ))}
    </div>
  );
}
