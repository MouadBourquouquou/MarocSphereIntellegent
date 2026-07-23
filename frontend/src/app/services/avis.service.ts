import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Avis } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AvisService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/avis`;

  getByGuideId(guideId: number) {
    return this.http.get<Avis[]>(`${this.baseUrl}/guide/${guideId}`);
  }

  getByArtisanId(artisanId: number) {
    return this.http.get<Avis[]>(`${this.baseUrl}/artisan/${artisanId}`);
  }

  getById(id: number) {
    return this.http.get<Avis>(`${this.baseUrl}/${id}`);
  }

  create(data: { auteurId: number; cibleId?: number; artisanId?: number; note: number; commentaire: string }) {
    return this.http.post<Avis>(this.baseUrl, data);
  }
}
