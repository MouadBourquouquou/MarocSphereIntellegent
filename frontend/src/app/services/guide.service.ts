import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Guide } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class GuideService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/guides`;

  getAll() {
    return this.http.get<Guide[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Guide>(`${this.baseUrl}/${id}`);
  }

  getMe() {
    return this.http.get<Guide>(`${this.baseUrl}/me`);
  }

  updateProfile(id: number, data: Partial<Guide>) {
    return this.http.put<Guide>(`${this.baseUrl}/${id}`, data);
  }
}
