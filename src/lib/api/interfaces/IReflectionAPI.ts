// Reflection API Interface
import type { Learning, ReflectionResult } from '../types';

export interface IReflectionAPI {
  getLearnings(limit?: number, userId?: string): Promise<Learning[]>;
  runReflection(userId?: string): Promise<ReflectionResult>;
}
