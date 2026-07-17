import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  nationalite: string;
  languePreferee: string;
  role: string;
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
  dateCreation: string;
}

export interface ReservationItem {
  id: number;
  clientId: number;
  guideId: number | null;
  statut: string;
  date: string;
}

export type EntityRow =
  | (ClientUser  & { _type: 'CLIENT' })
  | (GuideUser   & { _type: 'GUIDE' })
  | (ArtisanUser & { _type: 'ARTISAN' })
  | (DmcUser     & { _type: 'DMC' });

const BASE = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  /* ── Clients ── */
  getClients(): Observable<ClientUser[]>        { return this.http.get<ClientUser[]>(`${BASE}/clients`); }
  deleteClient(id: number): Observable<void>    { return this.http.delete<void>(`${BASE}/clients/${id}`); }

  /* ── Guides ── */
  getGuides(): Observable<GuideUser[]>          { return this.http.get<GuideUser[]>(`${BASE}/guides`); }
  deleteGuide(id: number): Observable<void>     { return this.http.delete<void>(`${BASE}/guides/${id}`); }

  /* ── Artisans ── */
  getArtisans(): Observable<ArtisanUser[]>      { return this.http.get<ArtisanUser[]>(`${BASE}/artisans`); }
  deleteArtisan(id: number): Observable<void>   { return this.http.delete<void>(`${BASE}/artisans/${id}`); }

  /* ── DMCs ── */
  getDmcs(): Observable<DmcUser[]>              { return this.http.get<DmcUser[]>(`${BASE}/dmcs`); }
  deleteDmc(id: number): Observable<void>       { return this.http.delete<void>(`${BASE}/dmcs/${id}`); }

  /* ── Reservations ── */
  getReservations(): Observable<ReservationItem[]> { return this.http.get<ReservationItem[]>(`${BASE}/reservations`); }
  deleteReservation(id: number): Observable<void>  { return this.http.delete<void>(`${BASE}/reservations/${id}`); }

  /* ── Admins ── */
  getAdmins(): Observable<AdminUser[]>          { return this.http.get<AdminUser[]>(`${BASE}/admins`); }
  deleteAdmin(id: number): Observable<void>     { return this.http.delete<void>(`${BASE}/admins/${id}`); }
}
