import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import {
  ChatMessage,
  ChatMessageRequest,
  Conversation,
  Message,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/messages`;

  private conversations = signal<Conversation[]>([]);
  private conversationMessages = signal<Map<string, Message[]>>(new Map());

  allConversations = computed(() => this.conversations());

  private makeId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  listConversations(clientId: number): Conversation[] {
    return this.conversations().filter((c) => c.clientId === clientId);
  }

  getConversationById(id: string): Conversation | undefined {
    return this.conversations().find((c) => c.id === id);
  }

  openOrCreateConversation(clientId: number, guideId: number): Conversation {
    const existing = this.conversations().find(
      (c) => c.clientId === clientId && c.guideId === guideId,
    );
    if (existing) return existing;

    const conversation: Conversation = {
      id: this.makeId('conv'),
      clientId,
      guideId,
      lastMessage: '',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    };
    this.conversations.update((list) => [conversation, ...list]);
    this.conversationMessages.update((map) => {
      const next = new Map(map);
      next.set(conversation.id, []);
      return next;
    });
    return conversation;
  }

  getMessages(conversationId: string): Message[] {
    return this.conversationMessages().get(conversationId) ?? [];
  }

  sendConversationMessage(conversationId: string, senderId: number, senderRole: Message['senderRole'], content: string): Message {
    const message: Message = {
      id: this.makeId('msg'),
      conversationId,
      senderId,
      senderRole,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.conversationMessages.update((map) => {
      const next = new Map(map);
      const existing = next.get(conversationId) ?? [];
      next.set(conversationId, [...existing, message]);
      return next;
    });
    this.conversations.update((list) =>
      list.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: content, lastMessageAt: message.timestamp }
          : c,
      ),
    );
    return message;
  }

  markConversationRead(conversationId: string): void {
    this.conversations.update((list) =>
      list.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
    );
    this.conversationMessages.update((map) => {
      const next = new Map(map);
      const messages = next.get(conversationId);
      if (messages) {
        next.set(
          conversationId,
          messages.map((m) => ({ ...m, read: true })),
        );
      }
      return next;
    });
  }

  getHistory(clientId: number) {
    return this.http.get<ChatMessage[]>(`${this.baseUrl}/${clientId}`);
  }

  sendMessage(request: ChatMessageRequest) {
    return this.http.post<ChatMessage>(this.baseUrl, request);
  }
}
