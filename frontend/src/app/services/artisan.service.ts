import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Artisan } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ArtisanService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/artisans`;

  getAll() {
    return this.http.get<Artisan[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Artisan>(`${this.baseUrl}/${id}`);
  }
}
