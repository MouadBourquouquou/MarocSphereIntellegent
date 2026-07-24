import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface LandmarkItem {
  id: number;
  nom: string;
  categorie: string;
  zone: string;
  latitude: number;
  longitude: number;
  categoriePrix: string;
  prixEntree: number;
  historicalPeriod: string | null;
  unesco: boolean;
  intangibleHeritage: string | null;
  architecturalNotes: string | null;
  description: string | null;
}

export interface CreateLandmarkPayload {
  nom: string;
  categorie: string;
  zone: string;
  latitude: number;
  longitude: number;
  categoriePrix: string;
  prixEntree: number;
  historicalPeriod?: string | null;
  unesco?: boolean;
  intangibleHeritage?: string | null;
  architecturalNotes?: string | null;
  description?: string | null;
}

export interface UpdateLandmarkPayload {
  nom?: string;
  categorie?: string;
  zone?: string;
  latitude?: number;
  longitude?: number;
  categoriePrix?: string;
  prixEntree?: number;
  historicalPeriod?: string | null;
  unesco?: boolean;
  intangibleHeritage?: string | null;
  architecturalNotes?: string | null;
  description?: string | null;
}

@Injectable({ providedIn: 'root' })
export class LandmarkService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/admin/landmarks`;
  private readonly publicUrl = `${API_BASE_URL}/landmarks`;

  getAll(): Observable<LandmarkItem[]> {
    return this.http.get<LandmarkItem[]>(this.baseUrl);
  }

  getAllPublic(): Observable<LandmarkItem[]> {
    return this.http.get<LandmarkItem[]>(this.publicUrl);
  }

  getById(id: number): Observable<LandmarkItem> {
    return this.http.get<LandmarkItem>(`${this.baseUrl}/${id}`);
  }

  create(p: CreateLandmarkPayload): Observable<LandmarkItem> {
    return this.http.post<LandmarkItem>(this.baseUrl, p);
  }

  update(id: number, p: UpdateLandmarkPayload): Observable<LandmarkItem> {
    return this.http.put<LandmarkItem>(`${this.baseUrl}/${id}`, p);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  importCsv(file: File): Observable<LandmarkItem[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<LandmarkItem[]>(`${this.baseUrl}/import-csv`, formData);
  }
}
