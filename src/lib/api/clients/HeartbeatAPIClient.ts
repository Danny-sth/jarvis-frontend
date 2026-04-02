// Heartbeat API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IHeartbeatAPI } from '../interfaces/IHeartbeatAPI';
import type { HeartbeatConfig, HeartbeatResult } from '../types';

export class HeartbeatAPIClient extends BaseAPIClient implements IHeartbeatAPI {
  async getConfig(userId?: string): Promise<HeartbeatConfig> {
    const uid = userId || this.getCurrentUserId();
    return this.get<HeartbeatConfig>(`/heartbeat/config?user_id=${uid}`);
  }

  async updateConfig(config: HeartbeatConfig, userId?: string): Promise<void> {
    const uid = userId || this.getCurrentUserId();
    await this.put<void>(`/heartbeat/config?user_id=${uid}`, config);
  }

  async run(userId?: string): Promise<HeartbeatResult> {
    const uid = userId || this.getCurrentUserId();
    return this.post<HeartbeatResult>(`/heartbeat/run?user_id=${uid}`);
  }

  async getAvailableChecks(): Promise<string[]> {
    return this.get<string[]>('/heartbeat/checks');
  }
}
