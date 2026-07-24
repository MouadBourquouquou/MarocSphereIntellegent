import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { GuideConversation, GuideMessage, GuideMessageCreationRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class GuideMessageService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/guide-messages`;

  getConversations() {
    return this.http.get<GuideConversation[]>(`${this.baseUrl}/conversations`);
  }

  getMessages(conversationId: number) {
    return this.http.get<GuideMessage[]>(`${this.baseUrl}/conversations/${conversationId}/messages`);
  }

  sendMessage(data: GuideMessageCreationRequest) {
    return this.http.post<GuideMessage>(`${this.baseUrl}/send`, data);
  }

  getOrCreateConversation(clientId: number) {
    return this.http.post<GuideConversation>(`${this.baseUrl}/conversations`, null, {
      params: { clientId: clientId.toString() }
    });
  }
}
