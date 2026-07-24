import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Experience, ExperienceCreationRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/experiences`;

  getMyExperiences() {
    return this.http.get<Experience[]>(`${this.baseUrl}/guide/me`);
  }

  getByGuideId(guideId: number) {
    return this.http.get<Experience[]>(`${this.baseUrl}/guide/${guideId}`);
  }

  getById(id: number) {
    return this.http.get<Experience>(`${this.baseUrl}/${id}`);
  }

  create(data: ExperienceCreationRequest) {
    return this.http.post<Experience>(this.baseUrl, data);
  }

  update(id: number, data: ExperienceCreationRequest) {
    return this.http.put<Experience>(`${this.baseUrl}/${id}`, data);
  }

  toggleStatus(id: number) {
    return this.http.patch<Experience>(`${this.baseUrl}/${id}/toggle-status`, {});
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
