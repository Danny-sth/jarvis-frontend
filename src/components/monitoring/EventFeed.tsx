import { useQuery } from '@tanstack/react-query';
import type { MonitoringEvent } from '../../lib/api';
import { useMonitoringAPI } from '../../contexts/APIContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/utils';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { getStatusVariant, getTypeVariant } from '../../lib/config/eventMappings';

export function EventFeed() {
  const isMobile = useIsMobile();
  const monitoringAPI = useMonitoringAPI();

  const { data, isLoading } = useQuery({
    queryKey: ['monitoring-events'],
    queryFn: () => monitoringAPI.getEvents({ limit: 20 }),
    refetchInterval: 15000, // 15 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <div className="mb-4">
          <h2 className="text-2xl font-display text-jarvis-cyan">RECENT EVENTS</h2>
          <p className="text-sm font-body text-jarvis-text-muted mt-1">
            Last 20 monitoring events
          </p>
        </div>
        <div className="text-sm text-jarvis-text-muted">Loading events...</div>
      </Card>
    );
  }

  const events = data?.events || [];

  if (events.length === 0) {
    return (
      <Card>
        <div className="mb-4">
          <h2 className="text-2xl font-display text-jarvis-cyan">RECENT EVENTS</h2>
          <p className="text-sm font-body text-jarvis-text-muted mt-1">
            Last 20 monitoring events
          </p>
        </div>
        <div className="text-sm text-jarvis-text-muted">No events found</div>
      </Card>
    );
  }

  // Mobile view - cards
  if (isMobile) {
    return (
      <Card>
        <div className="mb-4">
          <h2 className="text-2xl font-display text-jarvis-cyan">RECENT EVENTS</h2>
          <p className="text-sm font-body text-jarvis-text-muted mt-1">
            Last 20 monitoring events
          </p>
        </div>

        <div className="grid gap-4">
          {events.map((event: MonitoringEvent) => (
            <div
              key={event.id}
              className="bg-jarvis-bg-card border border-jarvis-cyan/10 rounded-lg p-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={getTypeVariant(event.event_type)} size="sm">
                    {event.event_type}
                  </Badge>
                  <Badge variant={getStatusVariant(event.status)} size="sm">
                    {event.status}
                  </Badge>
                </div>
                <p className="text-sm font-body text-jarvis-text-primary font-semibold">
                  {event.name}
                </p>
                <div className="flex justify-between text-xs text-jarvis-text-muted">
                  <span>{formatDate(event.created_at)}</span>
                  <span className="font-mono">{event.duration_ms}ms</span>
                </div>
                {event.error_message && (
                  <p className="text-xs text-jarvis-orange mt-2 font-mono">
                    {event.error_message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Desktop view - table
  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-2xl font-display text-jarvis-cyan">RECENT EVENTS</h2>
        <p className="text-sm font-body text-jarvis-text-muted mt-1">
          Last 20 monitoring events
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-jarvis-cyan/20">
              <th className="text-left py-3 px-2 text-xs font-body text-jarvis-text-muted uppercase">
                Time
              </th>
              <th className="text-left py-3 px-2 text-xs font-body text-jarvis-text-muted uppercase">
                Type
              </th>
              <th className="text-left py-3 px-2 text-xs font-body text-jarvis-text-muted uppercase">
                Name
              </th>
              <th className="text-left py-3 px-2 text-xs font-body text-jarvis-text-muted uppercase">
                Status
              </th>
              <th className="text-right py-3 px-2 text-xs font-body text-jarvis-text-muted uppercase">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event: MonitoringEvent) => (
              <tr key={event.id} className="border-b border-jarvis-cyan/10">
                <td className="py-3 px-2 text-sm font-mono text-jarvis-text-secondary">
                  {formatDate(event.created_at)}
                </td>
                <td className="py-3 px-2">
                  <Badge variant={getTypeVariant(event.event_type)} size="sm">
                    {event.event_type}
                  </Badge>
                </td>
                <td className="py-3 px-2 text-sm font-body text-jarvis-text-primary">
                  {event.name}
                  {event.error_message && (
                    <div className="text-xs text-jarvis-orange mt-1 font-mono">
                      {event.error_message}
                    </div>
                  )}
                </td>
                <td className="py-3 px-2">
                  <Badge variant={getStatusVariant(event.status)} size="sm">
                    {event.status}
                  </Badge>
                </td>
                <td className="py-3 px-2 text-right text-sm font-mono text-jarvis-text-primary">
                  {event.duration_ms}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
