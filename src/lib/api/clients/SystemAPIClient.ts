// System API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { ISystemAPI } from '../interfaces/ISystemAPI';
import type { SystemInfo } from '../types';

export class SystemAPIClient extends BaseAPIClient implements ISystemAPI {
  async getVersion(): Promise<{ version: string }> {
    return this.get<{ version: string }>('/system/version');
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return this.get<SystemInfo>('/system/info');
  }
}
