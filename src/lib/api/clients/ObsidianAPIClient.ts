// Obsidian API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IObsidianAPI } from '../interfaces/IObsidianAPI';
import type { ObsidianSearchResult } from '../types';

export class ObsidianAPIClient extends BaseAPIClient implements IObsidianAPI {
  async listFiles(path = ''): Promise<string[]> {
    return this.get<string[]>(`/obsidian/list?path=${encodeURIComponent(path)}`);
  }

  async readFile(path: string): Promise<{ content: string }> {
    return this.get<{ content: string }>(`/obsidian/read?path=${encodeURIComponent(path)}`);
  }

  async writeFile(path: string, content: string): Promise<void> {
    await this.post<void>('/obsidian/write', { path, content });
  }

  async search(query: string): Promise<ObsidianSearchResult[]> {
    return this.get<ObsidianSearchResult[]>(`/obsidian/search?query=${encodeURIComponent(query)}`);
  }

  async getLinks(path: string): Promise<string[]> {
    return this.get<string[]>(`/obsidian/links?path=${encodeURIComponent(path)}`);
  }

  async getBacklinks(path: string): Promise<string[]> {
    return this.get<string[]>(`/obsidian/backlinks?path=${encodeURIComponent(path)}`);
  }
}
