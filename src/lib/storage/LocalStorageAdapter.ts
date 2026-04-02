// LocalStorage implementation of IStorage
import type { IStorage } from './IStorage';
import { logger } from '../logger';

export class LocalStorageAdapter implements IStorage {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      logger.error(`Failed to get item "${key}" from localStorage:`, error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      logger.error(`Failed to set item "${key}" in localStorage:`, error);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.error(`Failed to remove item "${key}" from localStorage:`, error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      logger.error('Failed to clear localStorage:', error);
    }
  }

  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }
}

// Singleton instance
export const localStorageAdapter = new LocalStorageAdapter();
