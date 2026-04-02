// Auth Service implementation
import type { IAuthService } from './IAuthService';
import type { IAuthAPI } from '../api/interfaces/IAuthAPI';
import { LocalStorageTokenProvider } from '../api/base/TokenProvider';

export class AuthService implements IAuthService {
  private authAPI: IAuthAPI;
  private tokenProvider: LocalStorageTokenProvider;

  constructor(
    authAPI: IAuthAPI,
    tokenProvider: LocalStorageTokenProvider
  ) {
    this.authAPI = authAPI;
    this.tokenProvider = tokenProvider;
  }

  async login(
    username: string,
    password: string
  ): Promise<{
    userId: string;
    username: string;
    role: string;
  }> {
    const response = await this.authAPI.login(username, password);

    // Save auth data via token provider
    this.tokenProvider.setToken(response.token);
    this.tokenProvider.setAuthData(response.user_id, username, response.role);

    return {
      userId: response.user_id.toString(),
      username: username,
      role: response.role,
    };
  }

  logout(): void {
    // Logout via auth API (clears token and redirects)
    this.authAPI.logout();
  }

  getAuthData(): {
    isAuthenticated: boolean;
    userId: string | null;
    username: string | null;
    role: string | null;
  } {
    const token = this.tokenProvider.getToken();
    const userId = this.tokenProvider.getUserId();
    const username = this.tokenProvider.getUsername();
    const role = this.tokenProvider.getRole();

    if (token && userId && username) {
      return {
        isAuthenticated: true,
        userId,
        username,
        role,
      };
    }

    return {
      isAuthenticated: false,
      userId: null,
      username: null,
      role: null,
    };
  }
}
