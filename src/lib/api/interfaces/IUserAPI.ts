// User Management API Interface
import type { User, CreateUserRequest, UpdateUserRequest } from '../types';

export interface IUserAPI {
  list(search?: string, role?: string): Promise<User[]>;
  create(user: CreateUserRequest): Promise<User>;
  update(id: number, updates: UpdateUserRequest): Promise<User>;
  deleteUser(id: number): Promise<void>;
}
