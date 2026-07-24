import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:8080/api';

// ── Response shapes (match backend DTOs) ────────────────────────────────────

export interface AdminUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  nationalite: string;
  languePreferee: string;
  role: string;
  status: string;
  dateCreation: string;
}

export interface ClientUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  nationalite: string;
  languePreferee: string;
  tierAbonnement: string | null;
  status: string;
  dateCreation: string;
}

export interface GuideUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  nationalite: string;
  languePreferee: string;
  numeroLicence: string;
  statutCertification: string;
  scoreCertification: number;
  disponible: boolean;
  status: string;
  dateCreation: string;
}

export interface ArtisanUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  nationalite: string;
  languePreferee: string;
  categorieArtisanat: string;
  qrTraceId: string;
  eligibleExport: boolean;
  independant: boolean;
  cooperativeId: number | null;
  avatarUrl?: string | null;
  status: string;
  dateCreation: string;
}

export interface DmcUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  nationalite: string;
  languePreferee: string;
  nomEntreprise: string;
  zoneCouverture: string;
  status: string;
  dateCreation: string;
}

export interface ReservationItem {
  id: number;
  clientId: number;
  clientName: string;
  resourceType: string;
  resourceId: number;
  resourceName: string;
  statut: string;
  date: string;
}

export interface PlatformStats {
  totalClients: number;
  totalGuides: number;
  totalArtisans: number;
  totalDmcs: number;
  totalAdmins: number;
  totalReservations: number;
  reservationsConfirmees: number;
  reservationsEnAttente: number;
  guidesDisponibles: number;
  artisansEligiblesExport: number;
}

// ── Creation payloads ────────────────────────────────────────────────────────

export interface CreateClientPayload {
  email: string; password: string;
  nom: string; prenom: string; telephone: string;
  nationalite: string; languePreferee: string;
  tierAbonnement?: string | null;
}

export interface CreateGuidePayload {
  email: string; password: string;
  nom: string; prenom: string; telephone: string;
  nationalite: string; languePreferee: string;
  numeroLicence?: string;
}

export interface CreateArtisanPayload {
  email: string; password: string;
  nom: string; prenom: string; telephone: string;
  nationalite: string; languePreferee: string;
  categorieArtisanat?: string;
  eligibleExport?: boolean;
  independant?: boolean;
  cooperativeId?: number | null;
}

export interface CreateDmcPayload {
  email: string; password: string;
  nom: string; prenom: string; telephone: string;
  nationalite: string; languePreferee: string;
  nomEntreprise?: string;
  zoneCouverture?: string;
}

export interface CreateAdminPayload {
  email: string; password: string;
  nom: string; prenom: string; telephone: string;
  nationalite: string; languePreferee: string;
  role: string; // 'ADMIN' | 'ADMIN_DATA'
}

// ── Update payloads ──────────────────────────────────────────────────────────

export interface UpdateClientPayload {
  nom?: string; prenom?: string; telephone?: string;
  nationalite?: string; languePreferee?: string;
  status?: string;
}

export interface UpdateGuidePayload {
  nom?: string; prenom?: string; telephone?: string;
  nationalite?: string; languePreferee?: string;
  numeroLicence?: string; statutCertification?: string; disponible?: boolean;
  status?: string;
}

export interface UpdateArtisanPayload {
  nom?: string; prenom?: string; telephone?: string;
  nationalite?: string; languePreferee?: string;
  categorieArtisanat?: string; eligibleExport?: boolean; independant?: boolean;
  avatarUrl?: string; bannerUrl?: string;
  status?: string;
}

export interface UpdateDmcPayload {
  nomEntreprise?: string; zoneCouverture?: string;
  status?: string;
}

export interface UpdateAdminPayload {
  nom?: string; prenom?: string; telephone?: string;
  nationalite?: string; languePreferee?: string;
  status?: string;
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  /* ── Stats ── */
  getStats(): Observable<PlatformStats> {
    return this.http.get<PlatformStats>(`${BASE}/admins/stats`);
  }

  /* ── Clients ── */
  getClients(): Observable<ClientUser[]>                                      { return this.http.get<ClientUser[]>(`${BASE}/clients`); }
  createClient(p: CreateClientPayload): Observable<ClientUser>               { return this.http.post<ClientUser>(`${BASE}/clients`, p); }
  updateClient(id: number, p: UpdateClientPayload): Observable<ClientUser>   { return this.http.put<ClientUser>(`${BASE}/clients/${id}`, p); }
  deleteClient(id: number): Observable<void>                                 { return this.http.delete<void>(`${BASE}/clients/${id}`); }

  /* ── Guides ── */
  getGuides(): Observable<GuideUser[]>                                        { return this.http.get<GuideUser[]>(`${BASE}/guides`); }
  createGuide(p: CreateGuidePayload): Observable<GuideUser>                  { return this.http.post<GuideUser>(`${BASE}/guides`, p); }
  updateGuide(id: number, p: UpdateGuidePayload): Observable<GuideUser>      { return this.http.put<GuideUser>(`${BASE}/guides/${id}`, p); }
  deleteGuide(id: number): Observable<void>                                  { return this.http.delete<void>(`${BASE}/guides/${id}`); }

  /* ── Artisans ── */
  getArtisans(): Observable<ArtisanUser[]>                                    { return this.http.get<ArtisanUser[]>(`${BASE}/artisans`); }
  createArtisan(p: CreateArtisanPayload): Observable<ArtisanUser>            { return this.http.post<ArtisanUser>(`${BASE}/artisans`, p); }
  updateArtisan(id: number, p: UpdateArtisanPayload): Observable<ArtisanUser>{ return this.http.put<ArtisanUser>(`${BASE}/artisans/${id}`, p); }
  deleteArtisan(id: number): Observable<void>                                { return this.http.delete<void>(`${BASE}/artisans/${id}`); }

  /* ── DMCs ── */
  getDmcs(): Observable<DmcUser[]>                                            { return this.http.get<DmcUser[]>(`${BASE}/dmcs`); }
  createDmc(p: CreateDmcPayload): Observable<DmcUser>                        { return this.http.post<DmcUser>(`${BASE}/dmcs`, p); }
  updateDmc(id: number, p: UpdateDmcPayload): Observable<DmcUser>            { return this.http.put<DmcUser>(`${BASE}/dmcs/${id}`, p); }
  deleteDmc(id: number): Observable<void>                                    { return this.http.delete<void>(`${BASE}/dmcs/${id}`); }

  /* ── Reservations ── */
  getReservations(): Observable<ReservationItem[]>                            { return this.http.get<ReservationItem[]>(`${BASE}/reservations`); }
  deleteReservation(id: number): Observable<void>                            { return this.http.delete<void>(`${BASE}/reservations/${id}`); }

  /* ── Admins ── */
  getAdmins(): Observable<AdminUser[]>                                        { return this.http.get<AdminUser[]>(`${BASE}/admins`); }
  createAdmin(p: CreateAdminPayload): Observable<AdminUser>                  { return this.http.post<AdminUser>(`${BASE}/admins`, p); }
  updateAdmin(id: number, p: UpdateAdminPayload): Observable<AdminUser>      { return this.http.put<AdminUser>(`${BASE}/admins/${id}`, p); }
  deleteAdmin(id: number): Observable<void>                                  { return this.http.delete<void>(`${BASE}/admins/${id}`); }
}
