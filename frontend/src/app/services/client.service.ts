import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { ClientProfile, Itineraire, Reservation } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/clients`;

  getMe() {
    return this.http.get<ClientProfile>(`${this.baseUrl}/me`);
  }

  getById(id: number) {
    return this.http.get<ClientProfile>(`${this.baseUrl}/${id}`);
  }

  updateProfile(id: number, data: Partial<ClientProfile>) {
    return this.http.put<ClientProfile>(`${this.baseUrl}/${id}`, data);
  }

  getItineraires(clientId: number) {
    return this.http.get<Itineraire[]>(`${this.baseUrl}/${clientId}/itineraires`);
  }

  getReservations(clientId: number) {
    return this.http.get<Reservation[]>(`${this.baseUrl}/${clientId}/reservations`);
  }
}
