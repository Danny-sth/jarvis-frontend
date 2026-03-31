import { useQuery } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import { api } from '../lib/api-client';
import { Skeleton } from './ui/Skeleton';

interface CronPreviewProps {
  cron: string;
  timezone: string;
  count?: number;
}

export function CronPreview({ cron, timezone, count = 5 }: CronPreviewProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cron-preview', cron, timezone, count],
    queryFn: () => api.previewCron(cron, timezone, count),
    enabled: cron.length > 0 && timezone.length > 0,
    retry: false,
    staleTime: 0, // Always refetch when inputs change
  });

  if (!cron || !timezone) {
    return null;
  }

  return (
    <div className="bg-jarvis-bg-card border border-jarvis-cyan/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-jarvis-cyan" />
        <h4 className="text-sm font-body font-semibold text-jarvis-text-secondary">
          Next {count} runs:
        </h4>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </div>
      )}

      {error && (
        <p className="text-sm text-jarvis-orange">
          Invalid cron expression or timezone
        </p>
      )}

      {data && data.length > 0 && (
        <ul className="space-y-1">
          {data.map((date, i) => (
            <li key={i} className="text-sm font-mono text-jarvis-cyan">
              {new Date(date).toLocaleString('en-US', {
                timeZone: timezone,
                dateStyle: 'medium',
                timeStyle: 'medium',
              })}
            </li>
          ))}
        </ul>
      )}

      {data && data.length === 0 && (
        <p className="text-sm text-jarvis-text-muted">
          No upcoming runs found
        </p>
      )}
    </div>
  );
}
