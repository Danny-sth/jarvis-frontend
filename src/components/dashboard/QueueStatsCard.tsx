import { useQuery } from '@tanstack/react-query';
import { Activity, ListTodo, CheckCircle2, XCircle, Clock, Ban, Calendar } from 'lucide-react';
import { useQueueAPI } from '../../hooks/useAPI';
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
      label: 'TOTAL',
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
      label: 'QUEUED',
      value: queueStats?.queued ?? 0,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      label: 'SCHEDULED',
      value: queueStats?.scheduled ?? 0,
      icon: Calendar,
      color: 'text-blue-400',
    },
    {
      label: 'FAILED',
      value: queueStats?.failed ?? 0,
      icon: XCircle,
      color: 'text-jarvis-orange',
    },
    {
      label: 'CANCELLED',
      value: queueStats?.cancelled ?? 0,
      icon: Ban,
      color: 'text-jarvis-text-muted',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-body text-jarvis-text-muted mb-2">
                {stat.label}
              </p>
              <p className={`text-3xl font-display font-bold ${stat.color}`}>
                {stat.value.toLocaleString()}
              </p>
            </div>
            <stat.icon className={`w-10 h-10 ${stat.color} opacity-20`} />
          </div>
        </Card>
      ))}
    </div>
  );
}
