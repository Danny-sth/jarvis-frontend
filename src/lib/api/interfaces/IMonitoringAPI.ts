// Monitoring API Interface
import type { MonitoringEvent, LLMUsageSummary, StatsSummary } from '../types';

export interface IMonitoringAPI {
  getEvents(params?: MonitoringEventsParams): Promise<MonitoringEventsResponse>;
  getLLMUsage(params?: LLMUsageParams): Promise<LLMUsageSummary>;
  getStatsSummary(period?: string): Promise<StatsSummary>;
}

export interface MonitoringEventsParams {
  event_type?: string;
  status?: string;
  user_id?: string;
  request_id?: string;
  time_range?: string;
  limit?: number;
  offset?: number;
}

export interface MonitoringEventsResponse {
  total: number;
  limit: number;
  offset: number;
  events: MonitoringEvent[];
}

export interface LLMUsageParams {
  period?: string;
  caller?: string;
}
