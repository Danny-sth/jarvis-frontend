// Documentation API Interface
import type { DocCategory } from '../types';

export interface IDocsAPI {
  list(): Promise<DocCategory[]>;
}
