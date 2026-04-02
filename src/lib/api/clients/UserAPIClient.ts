// User Management API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IUserAPI } from '../interfaces/IUserAPI';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types';

export class UserAPIClient extends BaseAPIClient implements IUserAPI {
  async list(search?: string, role?: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (role) params.set('role', role);
    const queryString = params.toString();
    return this.get<User[]>(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async create(user: CreateUserRequest): Promise<User> {
    return this.post<User>('/users', user);
  }

  async update(id: number, updates: UpdateUserRequest): Promise<User> {
    return this.put<User>(`/users/${id}`, updates);
  }

  async deleteUser(id: number): Promise<void> {
    await super.delete<void>(`/users/${id}`);
  }
}
