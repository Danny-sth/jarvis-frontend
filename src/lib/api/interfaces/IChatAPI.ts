// Chat API Interface
import type { ChatResponse } from '../types';

export interface IChatAPI {
  sendChat(message: string, userId: string): Promise<ChatResponse>;
  streamChat(message: string, userId: string, onChunk: (chunk: string) => void): EventSource;
  clearChatHistory(userId: string): Promise<void>;
}
