// Activity API Interface
import type { ActivityEvent } from '../types';

export interface IActivityAPI {
  streamActivity(onEvent: (event: ActivityEvent) => void): EventSource;
}
