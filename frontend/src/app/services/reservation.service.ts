import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Reservation, ReservationRequest, ReservationStatus } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/reservations`;

  create(request: ReservationRequest) {
    return this.http.post<Reservation>(this.baseUrl, request);
  }

  updateStatus(id: number, status: ReservationStatus) {
    return this.http.patch<Reservation>(`${this.baseUrl}/${id}/status`, { status });
  }

  getByClientId(clientId: number) {
    return this.http.get<Reservation[]>(`${this.baseUrl}/client/${clientId}`);
  }
}
