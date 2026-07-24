import { Injectable, signal, computed } from '@angular/core';
import { Notification } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private items = signal<Notification[]>([]);

  allNotifications = computed(() => this.items());

  private makeId(): string {
    return `notif-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  push(data: Omit<Notification, 'id' | 'read' | 'date'>): Notification {
    const notification: Notification = {
      ...data,
      id: this.makeId(),
      date: new Date().toISOString(),
      read: false,
    };
    this.items.update((list) => [notification, ...list]);
    return notification;
  }

  listForRole(role: Notification['role']): Notification[] {
    return this.items().filter((n) => n.role === role);
  }

  unreadCount(role: Notification['role']): number {
    return this.listForRole(role).filter((n) => !n.read).length;
  }

  markRead(id: string): void {
    this.items.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  markAllRead(role: Notification['role']): void {
    this.items.update((list) =>
      list.map((n) => (n.role === role ? { ...n, read: true } : n)),
    );
  }
}
