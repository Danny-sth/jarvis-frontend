// Reflection API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IReflectionAPI } from '../interfaces/IReflectionAPI';
import type { Learning, ReflectionResult } from '../types';

export class ReflectionAPIClient extends BaseAPIClient implements IReflectionAPI {
  async getLearnings(limit = 20, userId?: string): Promise<Learning[]> {
    const uid = userId || this.getCurrentUserId();
    return this.get<Learning[]>(`/reflection/learnings?user_id=${uid}&limit=${limit}`);
  }

  async runReflection(userId?: string): Promise<ReflectionResult> {
    const uid = userId || this.getCurrentUserId();
    return this.post<ReflectionResult>(`/reflection/run?user_id=${uid}`);
  }
}
