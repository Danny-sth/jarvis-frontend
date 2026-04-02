import { useQuery } from '@tanstack/react-query';
import { Zap, DollarSign, Database } from 'lucide-react';
import { useMonitoringAPI } from '../../hooks/useAPI';
import { Card } from '../ui/Card';

export function LLMMetricsSection() {
  const monitoringAPI = useMonitoringAPI();

  const { data: liveMetrics } = useQuery({
    queryKey: ['live-metrics'],
    queryFn: () => monitoringAPI.getLiveMetrics(),
    refetchInterval: 5000,
    placeholderData: (previousData) => previousData,
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-display text-jarvis-cyan mb-4">LLM METRICS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-jarvis-text-muted mb-1">
                  TOTAL LLM CALLS
                </p>
                <p className="text-3xl font-display font-bold text-jarvis-cyan">
                  {liveMetrics?.llm.total_calls ?? 0}
                </p>
              </div>
              <Zap className="w-10 h-10 text-jarvis-cyan opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-jarvis-text-muted mb-1">
                  TOTAL COST
                </p>
                <p className="text-3xl font-display font-bold text-jarvis-purple">
                  ${liveMetrics?.llm.total_cost_usd.toFixed(2) ?? '0.00'}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-jarvis-purple opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-jarvis-text-muted mb-1">
                  TOOL EXECUTIONS
                </p>
                <p className="text-3xl font-display font-bold text-jarvis-orange">
                  {liveMetrics?.tools.total_executions ?? 0}
                </p>
              </div>
              <Database className="w-10 h-10 text-jarvis-orange opacity-20" />
            </div>
          </Card>
        </div>
      </div>

      {/* LLM Calls by Caller breakdown */}
      {liveMetrics && Object.keys(liveMetrics.llm.calls_by_caller).length > 0 && (
        <Card>
          <h3 className="text-lg font-display text-jarvis-cyan mb-4">
            CALLS BY CALLER
          </h3>
          <div className="space-y-3">
            {Object.entries(liveMetrics.llm.calls_by_caller).map(([caller, data]) => (
              <div key={caller} className="flex items-center justify-between">
                <span className="text-sm font-body text-jarvis-text-secondary">
                  {caller}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-jarvis-text-primary">
                    {data.count} calls
                  </span>
                  <span className="text-sm font-mono text-jarvis-purple">
                    ${data.cost.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
