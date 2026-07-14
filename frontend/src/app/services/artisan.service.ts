import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Artisan } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ArtisanService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/artisans`;

  getMe() {
    return this.http.get<Artisan>(`${this.baseUrl}/me`);
  }

  getAll() {
    return this.http.get<Artisan[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Artisan>(`${this.baseUrl}/${id}`);
  }

  updateProfile(id: number, data: Partial<Artisan>) {
    return this.http.put<Artisan>(`${this.baseUrl}/${id}`, data);
  }
}
