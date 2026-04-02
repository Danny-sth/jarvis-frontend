// Auth Service Interface
export interface IAuthService {
  login(username: string, password: string): Promise<{
    userId: string;
    username: string;
    role: string;
  }>;
  logout(): void;
  getAuthData(): {
    isAuthenticated: boolean;
    userId: string | null;
    username: string | null;
    role: string | null;
  };
}
