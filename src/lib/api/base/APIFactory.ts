// API Factory - creates and manages all API client instances
// Implements Factory pattern for API clients

import { LocalStorageTokenProvider } from './TokenProvider';
import { AuthAPIClient } from '../clients/AuthAPIClient';
import { QueueAPIClient } from '../clients/QueueAPIClient';
import { WorkflowAPIClient } from '../clients/WorkflowAPIClient';
import { ChatAPIClient } from '../clients/ChatAPIClient';
import { CortexAPIClient } from '../clients/CortexAPIClient';
import { ObsidianAPIClient } from '../clients/ObsidianAPIClient';
import { HeartbeatAPIClient } from '../clients/HeartbeatAPIClient';
import { RecurringTasksAPIClient } from '../clients/RecurringTasksAPIClient';
import { ReflectionAPIClient } from '../clients/ReflectionAPIClient';
import { SubtasksAPIClient } from '../clients/SubtasksAPIClient';
import { SystemAPIClient } from '../clients/SystemAPIClient';
import { UserAPIClient } from '../clients/UserAPIClient';
import { DocsAPIClient } from '../clients/DocsAPIClient';
import { MonitoringAPIClient } from '../clients/MonitoringAPIClient';
import { ActivityAPIClient } from '../clients/ActivityAPIClient';

// Import interfaces
import type { IAuthAPI } from '../interfaces/IAuthAPI';
import type { IQueueAPI } from '../interfaces/IQueueAPI';
import type { IWorkflowAPI } from '../interfaces/IWorkflowAPI';
import type { IChatAPI } from '../interfaces/IChatAPI';
import type { ICortexAPI } from '../interfaces/ICortexAPI';
import type { IObsidianAPI } from '../interfaces/IObsidianAPI';
import type { IHeartbeatAPI } from '../interfaces/IHeartbeatAPI';
import type { IRecurringTasksAPI } from '../interfaces/IRecurringTasksAPI';
import type { IReflectionAPI } from '../interfaces/IReflectionAPI';
import type { ISubtasksAPI } from '../interfaces/ISubtasksAPI';
import type { ISystemAPI } from '../interfaces/ISystemAPI';
import type { IUserAPI } from '../interfaces/IUserAPI';
import type { IDocsAPI } from '../interfaces/IDocsAPI';
import type { IMonitoringAPI } from '../interfaces/IMonitoringAPI';
import type { IActivityAPI } from '../interfaces/IActivityAPI';

export interface APIClients {
  auth: IAuthAPI;
  queue: IQueueAPI;
  workflow: IWorkflowAPI;
  chat: IChatAPI;
  cortex: ICortexAPI;
  obsidian: IObsidianAPI;
  heartbeat: IHeartbeatAPI;
  recurringTasks: IRecurringTasksAPI;
  reflection: IReflectionAPI;
  subtasks: ISubtasksAPI;
  system: ISystemAPI;
  user: IUserAPI;
  docs: IDocsAPI;
  monitoring: IMonitoringAPI;
  activity: IActivityAPI;
}

export class APIFactory {
  private static instance: APIFactory | null = null;
  private clients: APIClients | null = null;
  private tokenProvider: LocalStorageTokenProvider;
  private baseUrl: string;

  private constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    this.tokenProvider = new LocalStorageTokenProvider();
  }

  /**
   * Get singleton instance of APIFactory
   */
  static getInstance(baseUrl?: string): APIFactory {
    if (!APIFactory.instance) {
      APIFactory.instance = new APIFactory(baseUrl);
    }
    return APIFactory.instance;
  }

  /**
   * Get all API clients - lazy initialization
   */
  getClients(): APIClients {
    if (!this.clients) {
      this.clients = this.createClients();
    }
    return this.clients;
  }

  /**
   * Get token provider for direct access if needed
   */
  getTokenProvider(): LocalStorageTokenProvider {
    return this.tokenProvider;
  }

  /**
   * Create all API client instances
   */
  private createClients(): APIClients {
    return {
      auth: new AuthAPIClient(this.baseUrl, this.tokenProvider),
      queue: new QueueAPIClient(this.baseUrl, this.tokenProvider),
      workflow: new WorkflowAPIClient(this.baseUrl, this.tokenProvider),
      chat: new ChatAPIClient(this.baseUrl, this.tokenProvider),
      cortex: new CortexAPIClient(this.baseUrl, this.tokenProvider),
      obsidian: new ObsidianAPIClient(this.baseUrl, this.tokenProvider),
      heartbeat: new HeartbeatAPIClient(this.baseUrl, this.tokenProvider),
      recurringTasks: new RecurringTasksAPIClient(this.baseUrl, this.tokenProvider),
      reflection: new ReflectionAPIClient(this.baseUrl, this.tokenProvider),
      subtasks: new SubtasksAPIClient(this.baseUrl, this.tokenProvider),
      system: new SystemAPIClient(this.baseUrl, this.tokenProvider),
      user: new UserAPIClient(this.baseUrl, this.tokenProvider),
      docs: new DocsAPIClient(this.baseUrl, this.tokenProvider),
      monitoring: new MonitoringAPIClient(this.baseUrl, this.tokenProvider),
      activity: new ActivityAPIClient(this.baseUrl, this.tokenProvider),
    };
  }

  /**
   * Reset factory (useful for testing or logout)
   */
  static reset(): void {
    APIFactory.instance = null;
  }
}

// Export singleton factory instance
export const apiFactory = APIFactory.getInstance();

// Export clients for easy access
export const apiClients = apiFactory.getClients();
