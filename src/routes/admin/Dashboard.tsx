import { useQuery } from '@tanstack/react-query';
import { Activity, ListTodo, CheckCircle2, XCircle, Zap, DollarSign, Database } from 'lucide-react';
import { api } from '../../lib/api-client';
import { Card } from '../../components/ui/Card';
import { EventFeed } from '../../components/monitoring/EventFeed';
import { LLMCostChart } from '../../components/monitoring/LLMCostChart';

export default function Dashboard() {

  const { data: queueStats, isLoading: statsLoading } = useQuery({
    queryKey: ['queue-stats'],
    queryFn: () => api.getQueueStats(),
    refetchInterval: 5000,
  });

  const { data: systemInfo } = useQuery({
    queryKey: ['system-info'],
    queryFn: () => api.getSystemInfo(),
    refetchInterval: 10000,
  });

  // Monitoring queries
  const { data: liveMetrics } = useQuery({
    queryKey: ['live-metrics'],
    queryFn: () => api.getLiveMetrics(),
    refetchInterval: 5000, // 5 seconds
  });

  const { data: statsSummary } = useQuery({
    queryKey: ['stats-summary'],
    queryFn: () => api.getStatsSummary('last_24h'),
    refetchInterval: 30000, // 30 seconds
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display text-jarvis-cyan mb-2">DASHBOARD</h1>
        <p className="text-jarvis-text-secondary font-body">
          System overview and real-time stats
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-jarvis-text-muted mb-1">
                  {stat.label}
                </p>
                <p className={`text-3xl font-display font-bold ${stat.color}`}>
                  {statsLoading ? '...' : stat.value}
                </p>
              </div>
              <stat.icon className={`w-10 h-10 ${stat.color} opacity-20`} />
            </div>
          </Card>
        ))}
      </div>

      {/* System Info */}
      {systemInfo && (
        <Card>
          <h2 className="text-xl font-display text-jarvis-cyan mb-4">SYSTEM HEALTH</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-body text-jarvis-text-secondary">CPU</span>
                <span className="text-sm font-mono text-jarvis-text-primary">
                  {systemInfo.cpu_percent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-jarvis-bg-dark rounded-full h-2">
                <div
                  className="bg-jarvis-cyan h-2 rounded-full transition-all"
                  style={{ width: `${systemInfo.cpu_percent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-body text-jarvis-text-secondary">MEMORY</span>
                <span className="text-sm font-mono text-jarvis-text-primary">
                  {systemInfo.memory_percent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-jarvis-bg-dark rounded-full h-2">
                <div
                  className="bg-jarvis-purple h-2 rounded-full transition-all"
                  style={{ width: `${systemInfo.memory_percent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-body text-jarvis-text-secondary">DISK</span>
                <span className="text-sm font-mono text-jarvis-text-primary">
                  {systemInfo.disk_percent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-jarvis-bg-dark rounded-full h-2">
                <div
                  className="bg-jarvis-orange h-2 rounded-full transition-all"
                  style={{ width: `${systemInfo.disk_percent}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Version Info */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-body text-jarvis-text-muted mb-1">VERSION</p>
            <p className="text-lg font-mono text-jarvis-cyan">2.0.0</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-body text-jarvis-text-muted mb-1">UPTIME</p>
            <p className="text-lg font-mono text-jarvis-text-primary">
              {systemInfo ? Math.floor(systemInfo.uptime / 3600) + 'h' : '...'}
            </p>
          </div>
        </div>
      </Card>

      {/* LLM Metrics Section */}
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

      {/* API Performance Section */}
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
                <p className={`text-3xl font-display font-bold ${
                  (statsSummary?.api.error_rate ?? 0) > 5
                    ? 'text-jarvis-orange'
                    : 'text-green-500'
                }`}>
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

      {/* Event Feed */}
      <EventFeed />

      {/* LLM Cost Chart */}
      <LLMCostChart />
    </div>
  );
}
