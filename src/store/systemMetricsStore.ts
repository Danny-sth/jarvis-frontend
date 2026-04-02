import { create } from 'zustand';
import { SystemMetricsWSClient, createSystemMetricsWSUrl } from '../lib/websocket';

export interface SystemMetrics {
  cpu_percent: number;
  memory_percent: number;
  memory_used_gb: number;
  memory_total_gb: number;
  disk_percent: number;
  disk_used_gb: number;
  disk_total_gb: number;
  uptime_seconds: number;
}

interface SystemMetricsStore {
  metrics: SystemMetrics | null;
  isConnected: boolean;

  setMetrics: (metrics: SystemMetrics) => void;
  setConnected: (connected: boolean) => void;

  connect: () => void;
  disconnect: () => void;
}

// Create WebSocket client instance (outside Zustand store to avoid memory leak)
const wsClient = new SystemMetricsWSClient(createSystemMetricsWSUrl());

export const useSystemMetricsStore = create<SystemMetricsStore>((set) => {
  // Register callbacks on client
  wsClient.onMessage((metrics) => {
    set({ metrics });
  });

  wsClient.onConnectionChange((connected) => {
    set({ isConnected: connected });
  });

  return {
    metrics: null,
    isConnected: false,

    setMetrics: (metrics) => set({ metrics }),
    setConnected: (connected) => set({ isConnected: connected }),

    connect: () => {
      wsClient.connect();
    },

    disconnect: () => {
      wsClient.disconnect();
    },
  };
});
