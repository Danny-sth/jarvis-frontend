import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { AnimatedProgress, AnimatedCircularProgress } from '../ui/AnimatedProgress';
import { useSystemMetricsConnection } from './hooks/useSystemMetricsConnection';

export function SystemHealthCard() {
  const { metrics: systemInfo, isConnected } = useSystemMetricsConnection();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
            >
              <Activity className="w-6 h-6 text-jarvis-cyan" />
            </motion.div>
            <h2 className="text-xl font-display text-jarvis-cyan">SYSTEM HEALTH</h2>
          </div>
          <div className={`text-sm font-mono ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? '● LIVE' : '○ DISCONNECTED'}
          </div>
        </div>

        {systemInfo ? (
          <>
            {/* Circular Progress Grid for Desktop */}
            <div className="hidden md:grid md:grid-cols-3 gap-8 mb-6">
              <div className="flex flex-col items-center">
                <AnimatedCircularProgress
                  value={systemInfo.cpu_percent}
                  label="CPU"
                  color="cyan"
                  size={100}
                />
              </div>
              <div className="flex flex-col items-center">
                <AnimatedCircularProgress
                  value={systemInfo.memory_percent}
                  label="MEMORY"
                  color="purple"
                  size={100}
                />
              </div>
              <div className="flex flex-col items-center">
                <AnimatedCircularProgress
                  value={systemInfo.disk_percent}
                  label="DISK"
                  color="orange"
                  size={100}
                />
              </div>
            </div>

            {/* Linear Progress for Mobile */}
            <div className="md:hidden space-y-4">
              <AnimatedProgress
                value={systemInfo.cpu_percent}
                label="CPU"
                color="cyan"
                size="md"
              />
              <AnimatedProgress
                value={systemInfo.memory_percent}
                label="MEMORY"
                color="purple"
                size="md"
              />
              <AnimatedProgress
                value={systemInfo.disk_percent}
                label="DISK"
                color="orange"
                size="md"
              />
            </div>

            {/* Version and Uptime */}
            <div className="mt-6 pt-6 border-t border-jarvis-cyan/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body text-jarvis-text-muted mb-1">VERSION</p>
                  <p className="text-lg font-mono text-jarvis-cyan">2.0.0</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-body text-jarvis-text-muted mb-1">UPTIME</p>
                  <p className="text-lg font-mono text-jarvis-text-primary">
                    {Math.floor(systemInfo.uptime_seconds / 3600)}h
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-jarvis-text-muted">
            Connecting to system metrics...
          </div>
        )}
      </Card>
    </motion.div>
  );
}
