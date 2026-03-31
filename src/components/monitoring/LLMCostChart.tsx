import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { api } from '../../lib/api-client';
import { Card } from '../ui/Card';
import { useIsMobile } from '../../hooks/useMediaQuery';

export function LLMCostChart() {
  const isMobile = useIsMobile();

  const { data, isLoading } = useQuery({
    queryKey: ['llm-usage-7d'],
    queryFn: () => api.getLLMUsage({ period: 'last_7d' }),
    refetchInterval: 300000, // 5 minutes
  });

  if (isLoading) {
    return (
      <Card>
        <h2 className="text-2xl font-display text-jarvis-cyan mb-4">
          LLM COST TREND (7D)
        </h2>
        <div className="text-sm text-jarvis-text-muted">Loading chart...</div>
      </Card>
    );
  }

  // Transform data for recharts
  const chartData = data?.summary.by_caller
    ? Object.entries(data.summary.by_caller).map(([caller, stats]) => ({
        caller,
        cost: stats.cost_usd,
        calls: stats.calls,
      }))
    : [];

  if (chartData.length === 0) {
    return (
      <Card>
        <h2 className="text-2xl font-display text-jarvis-cyan mb-4">
          LLM COST TREND (7D)
        </h2>
        <div className="text-sm text-jarvis-text-muted">No LLM usage data available</div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-display text-jarvis-cyan mb-4">
        LLM COST TREND (7D)
      </h2>

      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" opacity={0.1} />
          <XAxis
            dataKey="caller"
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
            label={{
              value: 'Cost ($)',
              angle: -90,
              position: 'insideLeft',
              fill: '#9ca3af',
              fontSize: 12,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a2e',
              border: '1px solid #00d4ff',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '4px' }}
            itemStyle={{ color: '#e0e0e0', fontSize: '13px' }}
          />
          <Legend
            wrapperStyle={{ color: '#9ca3af', paddingTop: '10px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="cost"
            name="Cost ($)"
            stroke="#00d4ff"
            strokeWidth={2}
            dot={{ fill: '#00d4ff', r: 4 }}
            activeDot={{ r: 6, fill: '#00d4ff', stroke: '#fff', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="calls"
            name="Calls"
            stroke="#a855f7"
            strokeWidth={2}
            dot={{ fill: '#a855f7', r: 4 }}
            activeDot={{ r: 6, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }}
            yAxisId={0}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary stats below chart */}
      <div className="mt-4 pt-4 border-t border-jarvis-cyan/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-jarvis-text-muted">
              TOTAL COST (7D)
            </span>
            <span className="text-lg font-mono font-bold text-jarvis-purple">
              ${data?.summary.total_cost_usd.toFixed(2) ?? '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-jarvis-text-muted">
              TOTAL CALLS (7D)
            </span>
            <span className="text-lg font-mono font-bold text-jarvis-cyan">
              {data?.summary.total_calls.toLocaleString() ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
