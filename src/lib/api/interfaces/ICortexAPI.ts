// Cortex/Memory API Interface
import type { MemoryResult } from '../types';

export interface ICortexAPI {
  searchMemory(query: string, userId: string, limit?: number): Promise<MemoryResult[]>;
  storeMemory(content: string, userId: string, importance?: number): Promise<void>;
}
