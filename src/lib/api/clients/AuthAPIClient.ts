// Auth API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IAuthAPI, LoginResponse } from '../interfaces/IAuthAPI';

export class AuthAPIClient extends BaseAPIClient implements IAuthAPI {
  async login(username: string, password: string): Promise<LoginResponse> {
    return this.post<LoginResponse>('/auth/login', { username, password }, { skipAuth: true });
  }

  logout(): void {
    this.tokenProvider.clearAuth();
  }
}
