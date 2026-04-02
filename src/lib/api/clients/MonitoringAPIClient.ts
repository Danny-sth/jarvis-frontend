// Monitoring API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IMonitoringAPI, MonitoringEventsParams, MonitoringEventsResponse, LLMUsageParams } from '../interfaces/IMonitoringAPI';
import type { LiveMetrics, LLMUsageSummary, StatsSummary } from '../types';

export class MonitoringAPIClient extends BaseAPIClient implements IMonitoringAPI {
  async getLiveMetrics(): Promise<LiveMetrics> {
    return this.get<LiveMetrics>('/monitoring/metrics/live');
  }

  async getEvents(params?: MonitoringEventsParams): Promise<MonitoringEventsResponse> {
    const query = new URLSearchParams();
    if (params?.event_type) query.set('event_type', params.event_type);
    if (params?.status) query.set('status', params.status);
    if (params?.user_id) query.set('user_id', params.user_id);
    if (params?.request_id) query.set('request_id', params.request_id);
    if (params?.time_range) query.set('time_range', params.time_range);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());

    const queryString = query.toString();
    return this.get<MonitoringEventsResponse>(`/monitoring/events${queryString ? `?${queryString}` : ''}`);
  }

  async getLLMUsage(params?: LLMUsageParams): Promise<LLMUsageSummary> {
    const query = new URLSearchParams();
    if (params?.period) query.set('period', params.period);
    if (params?.caller) query.set('caller', params.caller);

    const queryString = query.toString();
    return this.get<LLMUsageSummary>(`/monitoring/llm/usage${queryString ? `?${queryString}` : ''}`);
  }

  async getStatsSummary(period?: string): Promise<StatsSummary> {
    const query = period ? `?period=${period}` : '';
    return this.get<StatsSummary>(`/monitoring/stats/summary${query}`);
  }
}
