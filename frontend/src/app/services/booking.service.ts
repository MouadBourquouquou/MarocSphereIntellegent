import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Booking,
  BookingType,
  BookingStatus,
  Review,
} from '../models/api.models';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private notifications = inject(NotificationService);

  private bookings = signal<Booking[]>([]);
  private reviews = signal<Review[]>([]);

  allBookings = computed(() => this.bookings());
  allReviews = computed(() => this.reviews());

  private makeId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  listBookings(filters?: { type?: BookingType; status?: BookingStatus; clientId?: number; guideId?: number; artisanId?: number }): Booking[] {
    let result = this.bookings();
    if (filters?.type) {
      result = result.filter((b) => b.type === filters.type);
    }
    if (filters?.status) {
      result = result.filter((b) => b.status === filters.status);
    }
    if (filters?.clientId !== undefined) {
      result = result.filter((b) => b.clientId === filters.clientId);
    }
    if (filters?.guideId !== undefined) {
      result = result.filter((b) => b.guideId === filters.guideId);
    }
    if (filters?.artisanId !== undefined) {
      result = result.filter((b) => b.artisanId === filters.artisanId);
    }
    return result;
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings().find((b) => b.id === id);
  }

  createBooking(data: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking {
    const booking: Booking = {
      ...data,
      id: this.makeId('bk'),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.bookings.update((items) => [booking, ...items]);
    this.emitBookingCreatedNotifications(booking);
    return booking;
  }

  updateBookingStatus(id: string, status: BookingStatus): Booking | undefined {
    let updated: Booking | undefined;
    this.bookings.update((bookings) =>
      bookings.map((b) => {
        if (b.id !== id) return b;
        updated = { ...b, status };
        return updated;
      }),
    );
    if (updated) {
      this.emitBookingStatusNotifications(updated);
    }
    return updated;
  }

  acceptBooking(id: string): Booking | undefined {
    return this.updateBookingStatus(id, 'accepted');
  }

  denyBooking(id: string): Booking | undefined {
    return this.updateBookingStatus(id, 'denied');
  }

  listReviews(filters?: { artisanId?: number; guideId?: number; clientId?: number }): Review[] {
    let result = this.reviews();
    if (filters?.artisanId !== undefined) {
      result = result.filter((r) => r.artisanId === filters.artisanId);
    }
    if (filters?.guideId !== undefined) {
      result = result.filter((r) => r.guideId === filters.guideId);
    }
    if (filters?.clientId !== undefined) {
      result = result.filter((r) => r.clientId === filters.clientId);
    }
    return result;
  }

  submitReview(data: Omit<Review, 'id' | 'date'>): Review {
    const review: Review = {
      ...data,
      id: this.makeId('rev'),
      date: new Date().toISOString(),
    };
    this.reviews.update((items) => [review, ...items]);
    this.notifications.push({
      role: 'ARTISAN',
      title: 'New review',
      message: 'A new review has been submitted.',
    });
    return review;
  }

  private emitBookingCreatedNotifications(booking: Booking): void {
    switch (booking.type) {
      case 'ai-itinerary':
      case 'experience':
        this.notifications.push({
          role: 'GUIDE',
          title: 'New booking request',
          message: `A new ${booking.type === 'ai-itinerary' ? 'AI itinerary' : 'experience'} booking request is awaiting your review.`,
        });
        break;
      case 'product':
        this.notifications.push({
          role: 'ARTISAN',
          title: 'New product request',
          message: 'A new product pickup request is awaiting your approval.',
        });
        break;
    }
    this.notifications.push({
      role: 'CLIENT',
      title: 'Booking submitted',
      message: 'Your booking request is now pending review.',
    });
  }

  private emitBookingStatusNotifications(booking: Booking): void {
    const label = booking.type === 'ai-itinerary' ? 'AI itinerary' : booking.type;
    if (booking.status === 'accepted') {
      this.notifications.push({
        role: 'CLIENT',
        title: `${label} booking confirmed`,
        message: `Your ${label} booking has been accepted.`,
      });
    } else if (booking.status === 'denied') {
      this.notifications.push({
        role: 'CLIENT',
        title: `${label} booking declined`,
        message: `Your ${label} booking has been declined.`,
      });
    }
  }
}
