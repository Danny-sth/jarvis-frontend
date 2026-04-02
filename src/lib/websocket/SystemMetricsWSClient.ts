// System Metrics WebSocket Client
import type { IWebSocketConnection } from './IWebSocketConnection';
import type { SystemMetrics } from '../../store/systemMetricsStore';
import { API_CONFIG, UI_CONFIG } from '../config';

export class SystemMetricsWSClient implements IWebSocketConnection<SystemMetrics> {
  private ws: WebSocket | null = null;
  private reconnectTimeout: number | null = null;
  private messageCallbacks: Array<(data: SystemMetrics) => void> = [];
  private connectionCallbacks: Array<(connected: boolean) => void> = [];
  private shouldReconnect = true;
  private wsUrl: string;

  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
  }

  connect(): void {
    // Clear any pending reconnect
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Disconnect existing connection
    if (this.ws) {
      this.disconnect();
    }

    this.shouldReconnect = true;
    this.ws = new WebSocket(this.wsUrl);

    this.ws.onopen = () => {
      console.log('[SystemMetrics] WebSocket connected');
      this.notifyConnectionChange(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'metrics' && message.data) {
          this.notifyMessage(message.data);
          this.notifyConnectionChange(true);
        }
      } catch (error) {
        console.error('[SystemMetrics] Failed to parse message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('[SystemMetrics] WebSocket error:', error);
      this.notifyConnectionChange(false);
    };

    this.ws.onclose = () => {
      console.log('[SystemMetrics] WebSocket disconnected');
      this.ws = null;
      this.notifyConnectionChange(false);

      // Auto-reconnect if should reconnect
      if (this.shouldReconnect) {
        this.reconnectTimeout = setTimeout(() => {
          this.connect();
        }, UI_CONFIG.WS_RECONNECT_DELAY);
      }
    };
  }

  disconnect(): void {
    this.shouldReconnect = false;

    // Clear reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Close WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.notifyConnectionChange(false);
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  onMessage(callback: (data: SystemMetrics) => void): void {
    this.messageCallbacks.push(callback);
  }

  onConnectionChange(callback: (connected: boolean) => void): void {
    this.connectionCallbacks.push(callback);
  }

  private notifyMessage(data: SystemMetrics): void {
    this.messageCallbacks.forEach((cb) => cb(data));
  }

  private notifyConnectionChange(connected: boolean): void {
    this.connectionCallbacks.forEach((cb) => cb(connected));
  }
}

// Factory function to create WebSocket URL
export function createSystemMetricsWSUrl(): string {
  return API_CONFIG.SYSTEM_METRICS_WS_URL;
}
