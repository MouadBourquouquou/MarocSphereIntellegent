import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { ChatMessage, ChatMessageRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/messages`;

  getHistory(clientId: number) {
    return this.http.get<ChatMessage[]>(`${this.baseUrl}/${clientId}`);
  }

  sendMessage(request: ChatMessageRequest) {
    return this.http.post<ChatMessage>(this.baseUrl, request);
  }
}
