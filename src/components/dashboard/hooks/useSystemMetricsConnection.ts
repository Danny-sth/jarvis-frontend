import { useEffect } from 'react';
import { useSystemMetricsStore } from '../../../store/systemMetricsStore';

/**
 * Custom hook to manage System Metrics WebSocket connection lifecycle
 * Automatically connects on mount and disconnects on unmount
 */
export function useSystemMetricsConnection() {
  const { metrics, isConnected, connect, disconnect } = useSystemMetricsStore();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    metrics,
    isConnected,
  };
}
