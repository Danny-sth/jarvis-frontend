// Heartbeat API Interface
import type { HeartbeatConfig, HeartbeatResult } from '../types';

export interface IHeartbeatAPI {
  getConfig(userId?: string): Promise<HeartbeatConfig>;
  updateConfig(config: HeartbeatConfig, userId?: string): Promise<void>;
  run(userId?: string): Promise<HeartbeatResult>;
  getAvailableChecks(): Promise<string[]>;
}
