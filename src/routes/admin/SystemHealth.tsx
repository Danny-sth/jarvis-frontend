import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Server, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSystemAPI } from '../../contexts/APIContext';
import { Card } from '../../components/ui/Card';
import { AnimatedProgress, AnimatedCircularProgress } from '../../components/ui/AnimatedProgress';
import { Skeleton } from '../../components/ui/Skeleton';
import { useSystemMetricsStore } from '../../store/systemMetricsStore';

export default function SystemHealth() {
  const { metrics, isConnected, connect, disconnect } = useSystemMetricsStore();
  const systemAPI = useSystemAPI();

  const { data: version } = useQuery({
    queryKey: ['system-version'],
    queryFn: () => systemAPI.getVersion(),
  });

  // Connect to WebSocket on mount
  useEffect(() => {
    connect();
    return () => disconnect(); // Cleanup on unmount
  }, [connect, disconnect]);

  // Loading state only on first load (no metrics yet)
  if (!metrics) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display text-jarvis-cyan mb-2">SYSTEM HEALTH</h1>
            <p className="text-jarvis-text-secondary font-body">
              Real-time system metrics and status
            </p>
          </div>
          <div className={`text-sm font-mono ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? '● LIVE' : '○ DISCONNECTED'}
          </div>
        </div>
      </motion.div>

      {/* Version Card */}
      {version && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
              >
                <Server className="w-8 h-8 text-jarvis-cyan" />
              </motion.div>
              <div>
                <p className="text-sm text-jarvis-text-muted font-body mb-1">JARVIS VERSION</p>
                <p className="text-2xl font-display text-jarvis-cyan">{version.version}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* System Metrics */}
      {metrics && (
        <>
          {/* Main Metrics Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
                >
                  <Activity className="w-6 h-6 text-jarvis-cyan" />
                </motion.div>
                <h2 className="text-xl font-display text-jarvis-cyan">SYSTEM METRICS</h2>
              </div>

              {/* Desktop: Circular Progress */}
              <div className="hidden md:grid md:grid-cols-3 gap-8 py-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                  className="flex flex-col items-center"
                >
                  <AnimatedCircularProgress
                    value={metrics.cpu_percent}
                    label="CPU"
                    color="cyan"
                    size={120}
                  />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                  className="flex flex-col items-center"
                >
                  <AnimatedCircularProgress
                    value={metrics.memory_percent}
                    label="MEMORY"
                    color="purple"
                    size={120}
                  />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                  className="flex flex-col items-center"
                >
                  <AnimatedCircularProgress
                    value={metrics.disk_percent}
                    label="DISK"
                    color="orange"
                    size={120}
                  />
                </motion.div>
              </div>

              {/* Mobile: Linear Progress */}
              <div className="md:hidden space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <AnimatedProgress
                    value={metrics.cpu_percent}
                    label="CPU"
                    color="cyan"
                    size="lg"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <AnimatedProgress
                    value={metrics.memory_percent}
                    label="MEMORY"
                    color="purple"
                    size="lg"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <AnimatedProgress
                    value={metrics.disk_percent}
                    label="DISK"
                    color="orange"
                    size="lg"
                  />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Uptime Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-cyan-500/20"
                  >
                    <Clock className="w-6 h-6 text-green-400" />
                  </motion.div>
                  <span className="text-lg font-display text-jarvis-cyan">UPTIME</span>
                </div>
                <motion.span
                  key={metrics.uptime_seconds}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl font-mono text-jarvis-text-primary"
                >
                  {Math.floor(metrics.uptime_seconds / 86400)}d{' '}
                  {Math.floor((metrics.uptime_seconds % 86400) / 3600)}h{' '}
                  {Math.floor((metrics.uptime_seconds % 3600) / 60)}m
                </motion.span>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
