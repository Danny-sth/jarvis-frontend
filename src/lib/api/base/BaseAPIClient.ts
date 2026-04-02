// Base API Client with shared request logic
// Implements DIP - depends on abstractions (ITokenProvider)

export interface ITokenProvider {
  getToken(): string | null;
  setToken(token: string | null): void;
  clearAuth(): void;
  getUserId(): string | null;
}

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export class BaseAPIClient {
  protected baseUrl: string;
  protected tokenProvider: ITokenProvider;

  constructor(baseUrl: string, tokenProvider: ITokenProvider) {
    this.baseUrl = baseUrl;
    this.tokenProvider = tokenProvider;
  }

  /**
   * Generic request method - handles auth, errors, and response parsing
   */
  protected async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    };

    // Add auth token if available and not skipped
    if (!skipAuth) {
      const token = this.tokenProvider.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.tokenProvider.clearAuth();
        throw new UnauthorizedError('Session expired. Please log in again.');
      }

      // Handle other errors
      if (!response.ok) {
        const error = await response.text();
        throw new APIError(`API Error: ${response.status} - ${error}`, response.status);
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof APIError) {
        throw error;
      }
      throw new NetworkError('Network request failed', error);
    }
  }

  /**
   * GET request helper
   */
  protected async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request helper
   */
  protected async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request helper
   */
  protected async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request helper
   */
  protected async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Get current user ID from token provider
   * Centralized method to avoid direct localStorage access in clients
   */
  protected getCurrentUserId(): string {
    return this.tokenProvider.getUserId() || '';
  }
}

// Custom error classes for better error handling
export class APIError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class NetworkError extends Error {
  public originalError?: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message);
    this.originalError = originalError;
    this.name = 'NetworkError';
  }
}
