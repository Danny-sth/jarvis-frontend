/* eslint-disable react-refresh/only-export-components */
import { createContext } from 'react';
import { useSystemMetricsStore, type SystemMetrics } from '../store/systemMetricsStore';

interface MetricsContextValue {
  metrics: SystemMetrics | null;
  isConnected: boolean;
  setMetrics: (metrics: SystemMetrics) => void;
  setConnected: (connected: boolean) => void;
  connect: () => void;
  disconnect: () => void;
}

export const MetricsContext = createContext<MetricsContextValue | null>(null);

export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const metricsState = useSystemMetricsStore();

  return <MetricsContext.Provider value={metricsState}>{children}</MetricsContext.Provider>;
}
