// Documentation API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IDocsAPI } from '../interfaces/IDocsAPI';
import type { DocCategory } from '../types';

export class DocsAPIClient extends BaseAPIClient implements IDocsAPI {
  async list(): Promise<DocCategory[]> {
    return this.get<DocCategory[]>('/docs/list');
  }
}
