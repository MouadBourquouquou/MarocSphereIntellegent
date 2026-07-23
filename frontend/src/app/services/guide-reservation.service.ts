import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { GuideReservation } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class GuideReservationService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/reservations`;

  getByGuideId(guideId: number) {
    return this.http.get<GuideReservation[]>(`${this.baseUrl}/guide/${guideId}`);
  }

  updateStatut(id: number, statut: string) {
    return this.http.patch<GuideReservation>(`${this.baseUrl}/${id}/statut`, { statut });
  }

  getAll() {
    return this.http.get<GuideReservation[]>(this.baseUrl);
  }
}
