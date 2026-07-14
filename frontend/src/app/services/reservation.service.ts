import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Reservation, ReservationRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/reservations`;

  create(request: ReservationRequest) {
    return this.http.post<Reservation>(this.baseUrl, request);
  }
}
