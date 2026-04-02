import { EventFeed } from '../../components/monitoring/EventFeed';
import { LLMCostChart } from '../../components/monitoring/LLMCostChart';
import { QueueStatsCard } from '../../components/dashboard/QueueStatsCard';
import { SystemHealthCard } from '../../components/dashboard/SystemHealthCard';
import { LLMMetricsSection } from '../../components/dashboard/LLMMetricsSection';
import { APIPerformanceCard } from '../../components/dashboard/APIPerformanceCard';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display text-jarvis-cyan mb-2">DASHBOARD</h1>
        <p className="text-jarvis-text-secondary font-body">
          System overview and real-time stats
        </p>
      </div>

      {/* Queue Stats */}
      <QueueStatsCard />

      {/* System Health (includes Version/Uptime) */}
      <SystemHealthCard />

      {/* LLM Metrics */}
      <LLMMetricsSection />

      {/* API Performance */}
      <APIPerformanceCard />

      {/* Event Feed */}
      <EventFeed />

      {/* LLM Cost Chart */}
      <LLMCostChart />
    </div>
  );
}
