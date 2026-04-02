// Obsidian API Interface
import type { ObsidianSearchResult } from '../types';

export interface IObsidianAPI {
  listFiles(path?: string): Promise<string[]>;
  readFile(path: string): Promise<{ content: string }>;
  writeFile(path: string, content: string): Promise<void>;
  search(query: string): Promise<ObsidianSearchResult[]>;
  getLinks(path: string): Promise<string[]>;
  getBacklinks(path: string): Promise<string[]>;
}
