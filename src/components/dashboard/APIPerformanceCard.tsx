import { useQuery } from '@tanstack/react-query';
import { useMonitoringAPI } from '../../hooks/useAPI';
import { Card } from '../ui/Card';

export function APIPerformanceCard() {
  const monitoringAPI = useMonitoringAPI();

  const { data: statsSummary } = useQuery({
    queryKey: ['stats-summary'],
    queryFn: () => monitoringAPI.getStatsSummary('last_24h'),
    refetchInterval: 30000,
    placeholderData: (previousData) => previousData,
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-display text-jarvis-cyan mb-4">
          API PERFORMANCE (24H)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div>
              <p className="text-sm font-body text-jarvis-text-muted mb-1">
                TOTAL REQUESTS
              </p>
              <p className="text-3xl font-display font-bold text-jarvis-cyan">
                {statsSummary?.api.total_requests.toLocaleString() ?? 0}
              </p>
            </div>
          </Card>

          <Card>
            <div>
              <p className="text-sm font-body text-jarvis-text-muted mb-1">
                ERROR RATE
              </p>
              <p
                className={`text-3xl font-display font-bold ${
                  (statsSummary?.api.error_rate ?? 0) > 5
                    ? 'text-jarvis-orange'
                    : 'text-green-500'
                }`}
              >
                {statsSummary?.api.error_rate.toFixed(2) ?? 0}%
              </p>
            </div>
          </Card>

          <Card>
            <div>
              <p className="text-sm font-body text-jarvis-text-muted mb-1">
                P95 LATENCY
              </p>
              <p className="text-3xl font-display font-bold text-jarvis-purple">
                {statsSummary?.api.p95_duration_ms ?? 0}ms
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
