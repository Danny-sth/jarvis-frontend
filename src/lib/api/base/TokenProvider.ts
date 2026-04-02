// Token Provider implementation - handles authentication token management
// Implements ITokenProvider for dependency injection

import type { ITokenProvider } from './BaseAPIClient';
import type { IStorage } from '../../storage';
import { localStorageAdapter } from '../../storage';
import { STORAGE_KEYS, ROUTES } from '../../config';

export class LocalStorageTokenProvider implements ITokenProvider {
  private storage: IStorage;
  private onLogout?: () => void;

  constructor(storage: IStorage = localStorageAdapter, onLogout?: () => void) {
    this.storage = storage;
    this.onLogout = onLogout;
  }

  getToken(): string | null {
    return this.storage.getItem(STORAGE_KEYS.TOKEN);
  }

  setToken(token: string | null): void {
    if (token) {
      this.storage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      this.storage.removeItem(STORAGE_KEYS.TOKEN);
    }
  }

  clearAuth(): void {
    this.storage.removeItem(STORAGE_KEYS.TOKEN);
    this.storage.removeItem(STORAGE_KEYS.USER_ID);
    this.storage.removeItem(STORAGE_KEYS.USERNAME);
    this.storage.removeItem(STORAGE_KEYS.ROLE);

    // Use callback for navigation if provided, otherwise use window.location as fallback
    if (this.onLogout) {
      this.onLogout();
    } else if (typeof window !== 'undefined') {
      window.location.href = ROUTES.LOGIN;
    }
  }

  // Helper methods for other auth data
  setAuthData(userId: number, username: string, role: string): void {
    this.storage.setItem(STORAGE_KEYS.USER_ID, userId.toString());
    this.storage.setItem(STORAGE_KEYS.USERNAME, username);
    this.storage.setItem(STORAGE_KEYS.ROLE, role);
  }

  getUserId(): string | null {
    return this.storage.getItem(STORAGE_KEYS.USER_ID);
  }

  getUsername(): string | null {
    return this.storage.getItem(STORAGE_KEYS.USERNAME);
  }

  getRole(): string | null {
    return this.storage.getItem(STORAGE_KEYS.ROLE);
  }
}
