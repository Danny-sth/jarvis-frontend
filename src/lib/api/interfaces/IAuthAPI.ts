// Auth API Interface - defines contract for authentication operations
export interface IAuthAPI {
  login(username: string, password: string): Promise<LoginResponse>;
  logout(): void;
}

export interface LoginResponse {
  token: string;
  user_id: number;
  role: string;
}
