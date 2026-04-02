// Chat API Client implementation
import { BaseAPIClient } from '../base/BaseAPIClient';
import type { IChatAPI } from '../interfaces/IChatAPI';
import type { ChatResponse } from '../types';

export class ChatAPIClient extends BaseAPIClient implements IChatAPI {
  async sendChat(message: string, userId: string): Promise<ChatResponse> {
    return this.post<ChatResponse>('/chat', { message, user_id: userId });
  }

  streamChat(message: string, userId: string, onChunk: (chunk: string) => void): EventSource {
    const url = new URL(`${this.baseUrl}/api/chat/stream`);
    url.searchParams.set('message', message);
    url.searchParams.set('user_id', userId);

    const eventSource = new EventSource(url.toString());
    eventSource.onmessage = (event) => {
      onChunk(event.data);
    };
    return eventSource;
  }

  async clearChatHistory(userId: string): Promise<void> {
    await this.post<void>(`/chat/clear?user_id=${userId}`);
  }
}
