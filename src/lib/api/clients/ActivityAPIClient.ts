// Activity API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IActivityAPI } from '../interfaces/IActivityAPI';
import type { ActivityEvent } from '../types';
import { logger } from '../../logger';

export class ActivityAPIClient extends BaseAPIClient implements IActivityAPI {
  streamActivity(onEvent: (event: ActivityEvent) => void): EventSource {
    const eventSource = new EventSource(`${this.baseUrl}/api/activity/stream`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent(data);
      } catch (e) {
        logger.error('Failed to parse activity event:', e);
      }
    };
    return eventSource;
  }
}
