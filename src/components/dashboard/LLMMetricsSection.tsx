import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Zap, DollarSign, Hash } from 'lucide-react';
import { useMonitoringAPI } from '../../hooks/useAPI';
import { Card } from '../ui/Card';

type Period = 'last_hour' | 'last_24h' | 'last_7d' | 'last_30d';

const PERIODS: { value: Period; label: string; fullLabel: string }[] = [
  { value: 'last_hour', label: '1H', fullLabel: 'Last hour' },
  { value: 'last_24h', label: '24H', fullLabel: 'Last 24 hours' },
  { value: 'last_7d', label: '7D', fullLabel: 'Last 7 days' },
  { value: 'last_30d', label: '30D', fullLabel: 'Last 30 days' },
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

  const currentPeriod = PERIODS.find((p) => p.value === period);

  return (
    <div className="space-y-6">
      <div>
        {/* Header with period selector */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display text-jarvis-cyan">LLM METRICS</h2>
          <div className="flex gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-5 py-2 text-base font-mono rounded-lg transition-all ${
                  period === p.value
                    ? 'bg-jarvis-cyan text-black font-bold shadow-lg shadow-jarvis-cyan/50'
                    : 'bg-jarvis-bg-surface text-jarvis-text-secondary hover:bg-jarvis-cyan/20 border-2 border-jarvis-cyan/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* PERIOD BANNER */}
        <div className="bg-jarvis-bg-surface border-2 border-jarvis-gold/50 rounded-lg px-6 py-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-jarvis-text-secondary font-body">PERIOD:</span>
            <span className="text-2xl font-display text-jarvis-gold font-bold">
              {currentPeriod?.fullLabel?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-jarvis-text-muted mb-2">
                  TOTAL LLM CALLS
                </p>
                <p className="text-4xl font-display font-bold text-jarvis-cyan">
                  {llmUsage?.summary.total_calls ?? 0}
                </p>
              </div>
              <Zap className="w-12 h-12 text-jarvis-cyan opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-jarvis-text-muted mb-2">
                  TOTAL COST
                </p>
                <p className="text-4xl font-display font-bold text-jarvis-purple">
                  ${llmUsage?.summary.total_cost_usd.toFixed(4) ?? '0.0000'}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-jarvis-purple opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-jarvis-text-muted mb-2">
                  TOTAL TOKENS
                </p>
                <p className="text-4xl font-display font-bold text-jarvis-orange">
                  {totalTokens.toLocaleString()}
                </p>
              </div>
              <Hash className="w-12 h-12 text-jarvis-orange opacity-20" />
            </div>
          </Card>
        </div>
      </div>

      {/* LLM Calls by Caller breakdown */}
      {llmUsage && Object.keys(llmUsage.summary.by_caller).length > 0 && (
        <Card>
          <h3 className="text-xl font-display text-jarvis-cyan mb-6">
            CALLS BY CALLER
          </h3>
          <div className="space-y-4">
            {Object.entries(llmUsage.summary.by_caller).map(([caller, data]) => (
              <div key={caller} className="flex items-center justify-between py-3 border-b border-jarvis-cyan/10 last:border-0">
                <span className="text-base font-body text-jarvis-text-secondary">
                  {caller}
                </span>
                <div className="flex items-center gap-6">
                  <span className="text-base font-mono text-jarvis-text-primary">
                    {data.calls} calls
                  </span>
                  <span className="text-base font-mono text-jarvis-cyan">
                    {(data.input_tokens + data.output_tokens).toLocaleString()} tok
                  </span>
                  <span className="text-base font-mono text-jarvis-purple font-bold">
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
