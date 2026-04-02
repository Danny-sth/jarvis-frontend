// Cortex API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { ICortexAPI } from '../interfaces/ICortexAPI';
import type { MemoryResult } from '../types';

export class CortexAPIClient extends BaseAPIClient implements ICortexAPI {
  async searchMemory(query: string, userId: string, limit = 10): Promise<MemoryResult[]> {
    return this.post<MemoryResult[]>('/cortex/search', { query, user_id: userId, limit });
  }

  async storeMemory(content: string, userId: string, importance = 5): Promise<void> {
    await this.post<void>('/cortex/store', { content, user_id: userId, importance });
  }
}
