import { useContext } from 'react';
import { MetricsContext } from '../contexts/MetricsContext';

/**
 * Facade hook for system metrics
 * Provides clean abstraction over SystemMetricsStore
 */
export function useMetrics() {
  const context = useContext(MetricsContext);

  if (!context) {
    throw new Error('useMetrics must be used within MetricsProvider');
  }

  return context;
}
