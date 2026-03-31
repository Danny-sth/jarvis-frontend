import { useQuery } from '@tanstack/react-query';
import { Server, Cpu, HardDrive, Activity } from 'lucide-react';
import { api } from '../../lib/api-client';
import { Card } from '../../components/ui/Card';

export default function SystemHealth() {
  const { data: systemInfo, isLoading } = useQuery({
    queryKey: ['system-info'],
    queryFn: () => api.getSystemInfo(),
    refetchInterval: 5000,
  });

  const { data: version } = useQuery({
    queryKey: ['system-version'],
    queryFn: () => api.getVersion(),
  });

  if (isLoading) {
    return (
      <div className="text-jarvis-cyan font-body">Loading system information...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display text-jarvis-cyan mb-2">SYSTEM HEALTH</h1>
        <p className="text-jarvis-text-secondary font-body">
          Real-time system metrics and status
        </p>
      </div>

      {/* Version */}
      {version && (
        <Card>
          <div className="flex items-center gap-4">
            <Server className="w-10 h-10 text-jarvis-cyan" />
            <div>
              <p className="text-sm text-jarvis-text-muted font-body mb-1">JARVIS VERSION</p>
              <p className="text-2xl font-display text-jarvis-cyan">{version.version}</p>
            </div>
          </div>
        </Card>
      )}

      {/* System Metrics */}
      {systemInfo && (
        <>
          {/* CPU */}
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <Cpu className="w-8 h-8 text-jarvis-cyan" />
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-display text-jarvis-cyan">CPU USAGE</span>
                  <span className="font-mono text-jarvis-text-primary">
                    {systemInfo.cpu_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[#2a2a2a] border-2 border-cyan-400/50 rounded-full h-4 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-cyan-300 h-full rounded-full transition-all duration-500 shadow-lg shadow-cyan-400/60"
                    style={{ width: `${systemInfo.cpu_percent}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Memory */}
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <Activity className="w-8 h-8 text-blue-400" />
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-display text-blue-400">MEMORY USAGE</span>
                  <span className="font-mono text-jarvis-text-primary">
                    {systemInfo.memory_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[#2a2a2a] border-2 border-blue-400/50 rounded-full h-4 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-blue-400/60"
                    style={{ width: `${systemInfo.memory_percent}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Disk */}
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <HardDrive className="w-8 h-8 text-jarvis-orange" />
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-display text-jarvis-orange">DISK USAGE</span>
                  <span className="font-mono text-jarvis-text-primary">
                    {systemInfo.disk_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[#2a2a2a] border-2 border-jarvis-orange/50 rounded-full h-4 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-jarvis-orange to-jarvis-gold h-full rounded-full transition-all duration-500 shadow-lg shadow-jarvis-orange/60"
                    style={{ width: `${systemInfo.disk_percent}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Uptime */}
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-lg font-display text-jarvis-cyan">UPTIME</span>
              <span className="text-2xl font-mono text-jarvis-text-primary">
                {Math.floor(systemInfo.uptime / 3600)}h {Math.floor((systemInfo.uptime % 3600) / 60)}m
              </span>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
