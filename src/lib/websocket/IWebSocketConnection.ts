// WebSocket connection interface
export interface IWebSocketConnection<T> {
  connect(): void;
  disconnect(): void;
  isConnected(): boolean;
  onMessage(callback: (data: T) => void): void;
  onConnectionChange(callback: (connected: boolean) => void): void;
}
