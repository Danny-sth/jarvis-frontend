// System API Interface
import type { SystemInfo } from '../types';

export interface ISystemAPI {
  getVersion(): Promise<{ version: string }>;
  getSystemInfo(): Promise<SystemInfo>;
}
