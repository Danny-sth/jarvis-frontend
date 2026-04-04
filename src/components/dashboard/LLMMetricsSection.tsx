import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Zap, DollarSign, Hash } from 'lucide-react';
import { useMonitoringAPI } from '../../hooks/useAPI';
import { Card } from '../ui/Card';

type Period = 'last_hour' | 'last_24h' | 'last_7d' | 'last_30d';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'last_hour', label: '1H' },
  { value: 'last_24h', label: '24H' },
  { value: 'last_7d', label: '7D' },
  { value: 'last_30d', label: '30D' },
];

export function LLMMetricsSection() {
  const [period, setPeriod] = useState<Period>('last_30d');
  const monitoringAPI = useMonitoringAPI();

  const { data: llmUsage } = useQuery({
    queryKey: ['llm-usage', period],
    queryFn: () => monitoringAPI.getLLMUsage({ period }),
    refetchInterval: 10000,
    placeholderData: (previousData) => previousData,
  });

  const totalTokens = llmUsage?.summary.by_caller
    ? Object.values(llmUsage.summary.by_caller).reduce(
        (sum, caller) => sum + caller.input_tokens + caller.output_tokens,
        0
      )
    : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display text-jarvis-cyan">LLM METRICS</h2>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1 text-sm font-mono rounded transition-colors ${
                  period === p.value
                    ? 'bg-jarvis-cyan text-jarvis-bg-dark'
                    : 'bg-jarvis-bg-card text-jarvis-text-muted hover:text-jarvis-cyan border border-jarvis-cyan/20'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-jarvis-text-muted mb-1">
                  TOTAL LLM CALLS
                </p>
                <p className="text-3xl font-display font-bold text-jarvis-cyan">
                  {llmUsage?.summary.total_calls ?? 0}
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
                  ${llmUsage?.summary.total_cost_usd.toFixed(4) ?? '0.0000'}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-jarvis-purple opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-jarvis-text-muted mb-1">
                  TOTAL TOKENS
                </p>
                <p className="text-3xl font-display font-bold text-jarvis-orange">
                  {totalTokens.toLocaleString()}
                </p>
              </div>
              <Hash className="w-10 h-10 text-jarvis-orange opacity-20" />
            </div>
          </Card>
        </div>
      </div>

      {/* LLM Calls by Caller breakdown */}
      {llmUsage && Object.keys(llmUsage.summary.by_caller).length > 0 && (
        <Card>
          <h3 className="text-lg font-display text-jarvis-cyan mb-4">
            CALLS BY CALLER
          </h3>
          <div className="space-y-3">
            {Object.entries(llmUsage.summary.by_caller).map(([caller, data]) => (
              <div key={caller} className="flex items-center justify-between">
                <span className="text-sm font-body text-jarvis-text-secondary">
                  {caller}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-jarvis-text-primary">
                    {data.calls} calls
                  </span>
                  <span className="text-sm font-mono text-jarvis-cyan">
                    {(data.input_tokens + data.output_tokens).toLocaleString()} tok
                  </span>
                  <span className="text-sm font-mono text-jarvis-purple">
                    ${data.cost_usd.toFixed(4)}
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
