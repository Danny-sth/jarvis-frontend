import { create } from 'zustand';

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
  websocket: WebSocket | null;

  setMetrics: (metrics: SystemMetrics) => void;
  setConnected: (connected: boolean) => void;

  connect: () => void;
  disconnect: () => void;
}

export const useSystemMetricsStore = create<SystemMetricsStore>((set, get) => ({
  metrics: null,
  isConnected: false,
  websocket: null,

  setMetrics: (metrics) => set({ metrics }),
  setConnected: (connected) => set({ isConnected: connected }),

  connect: () => {
    const { websocket, disconnect } = get();

    // Disconnect existing connection
    if (websocket) {
      disconnect();
    }

    // Create WebSocket connection
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';
    const wsUrl = apiUrl.replace(/^http/, 'ws') + '/ws/system/metrics';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[SystemMetrics] WebSocket connected');
      set({ isConnected: true });
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'metrics' && message.data) {
          set({ metrics: message.data, isConnected: true });
        }
      } catch (error) {
        console.error('[SystemMetrics] Failed to parse message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('[SystemMetrics] WebSocket error:', error);
      set({ isConnected: false });
    };

    ws.onclose = () => {
      console.log('[SystemMetrics] WebSocket disconnected');
      set({ isConnected: false, websocket: null });
      // Auto-reconnect after 3 seconds
      setTimeout(() => get().connect(), 3000);
    };

    set({ websocket: ws });
  },

  disconnect: () => {
    const { websocket } = get();
    if (websocket) {
      websocket.close();
      set({ websocket: null, isConnected: false });
    }
  },
}));
