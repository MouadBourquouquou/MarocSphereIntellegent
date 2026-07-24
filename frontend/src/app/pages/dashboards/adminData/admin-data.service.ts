import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

const BASE = 'http://localhost:8080/api';

// ── Backend DTO shapes ──────────────────────────────────────────────────────

export interface ClientDTO {
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

export interface GuideDTO {
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

export interface ArtisanDTO {
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
  avatarUrl: string | null;
  bannerUrl: string | null;
  dateCreation: string;
}

export interface DmcDTO {
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

export interface ReservationDTO {
  id: number;
  clientId: number;
  clientName: string;
  resourceType: string;
  resourceId: number;
  resourceName: string;
  statut: string;
  date: string;
}

export interface PlatformStatsDTO {
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

// ── View models used by the dashboard components ────────────────────────────

export interface DashboardMetrics {
  totalUsers: number;
  totalClients: number;
  totalGuides: number;
  totalArtisans: number;
  totalDmcs: number;
  totalReservations: number;
  reservationsConfirmees: number;
  reservationsEnAttente: number;
  guidesDisponibles: number;
  artisansEligiblesExport: number;
}

export interface ChartSeriesData {
  labels: string[];
  values: number[];
}

export interface AllEntities {
  clients: ClientDTO[];
  guides: GuideDTO[];
  artisans: ArtisanDTO[];
  dmcs: DmcDTO[];
  reservations: ReservationDTO[];
}

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private http = inject(HttpClient);

  /** Fetch the pre-computed stats from the backend (counts only). */
  getStats(): Observable<PlatformStatsDTO> {
    return this.http.get<PlatformStatsDTO>(`${BASE}/admins/stats`);
  }

  /** Fetch all entity lists in one parallel request. */
  getAllEntities(): Observable<AllEntities> {
    return forkJoin({
      clients:      this.http.get<ClientDTO[]>(`${BASE}/clients`),
      guides:       this.http.get<GuideDTO[]>(`${BASE}/guides`),
      artisans:     this.http.get<ArtisanDTO[]>(`${BASE}/artisans`),
      dmcs:         this.http.get<DmcDTO[]>(`${BASE}/dmcs`),
      reservations: this.http.get<ReservationDTO[]>(`${BASE}/reservations`),
    });
  }

  getClients(): Observable<ClientDTO[]> {
    return this.http.get<ClientDTO[]>(`${BASE}/clients`);
  }

  getGuides(): Observable<GuideDTO[]> {
    return this.http.get<GuideDTO[]>(`${BASE}/guides`);
  }

  getArtisans(): Observable<ArtisanDTO[]> {
    return this.http.get<ArtisanDTO[]>(`${BASE}/artisans`);
  }

  getDmcs(): Observable<DmcDTO[]> {
    return this.http.get<DmcDTO[]>(`${BASE}/dmcs`);
  }

  getReservations(): Observable<ReservationDTO[]> {
    return this.http.get<ReservationDTO[]>(`${BASE}/reservations`);
  }

  /** Map raw stats to the DashboardMetrics view model. */
  getSummaryMetrics(): Observable<DashboardMetrics> {
    return this.getStats().pipe(
      map(s => ({
        totalUsers: s.totalClients + s.totalGuides + s.totalArtisans + s.totalDmcs + s.totalAdmins,
        totalClients: s.totalClients,
        totalGuides: s.totalGuides,
        totalArtisans: s.totalArtisans,
        totalDmcs: s.totalDmcs,
        totalReservations: s.totalReservations,
        reservationsConfirmees: s.reservationsConfirmees,
        reservationsEnAttente: s.reservationsEnAttente,
        guidesDisponibles: s.guidesDisponibles,
        artisansEligiblesExport: s.artisansEligiblesExport,
      }))
    );
  }

  /**
   * Builds a breakdown chart from the guide languePreferee field —
   * counts how many guides speak each language.
   */
  getGuideLanguageBreakdown(): Observable<ChartSeriesData> {
    return this.getGuides().pipe(
      map(guides => {
        const counts: Record<string, number> = {};
        guides.forEach(g => {
          const lang = g.languePreferee || 'Unspecified';
          counts[lang] = (counts[lang] ?? 0) + 1;
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
        return { labels: sorted.map(e => e[0]), values: sorted.map(e => e[1]) };
      })
    );
  }

  /**
   * Builds a breakdown chart from the artisan categorieArtisanat field.
   */
  getArtisanCategoryBreakdown(): Observable<ChartSeriesData> {
    return this.getArtisans().pipe(
      map(artisans => {
        const counts: Record<string, number> = {};
        artisans.forEach(a => {
          const cat = a.categorieArtisanat || 'Other';
          counts[cat] = (counts[cat] ?? 0) + 1;
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
        return { labels: sorted.map(e => e[0]), values: sorted.map(e => e[1]) };
      })
    );
  }

  /**
   * Builds a reservation status breakdown.
   */
  getReservationStatusBreakdown(): Observable<ChartSeriesData> {
    return this.getReservations().pipe(
      map(reservations => {
        const counts: Record<string, number> = {};
        reservations.forEach(r => {
          const s = r.statut || 'INCONNU';
          counts[s] = (counts[s] ?? 0) + 1;
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return { labels: sorted.map(e => e[0]), values: sorted.map(e => e[1]) };
      })
    );
  }

  /**
   * Builds a client origin (nationalite) breakdown — top countries.
   */
  getClientOriginBreakdown(): Observable<ChartSeriesData> {
    return this.getClients().pipe(
      map(clients => {
        const counts: Record<string, number> = {};
        clients.forEach(c => {
          const n = c.nationalite || 'Unspecified';
          counts[n] = (counts[n] ?? 0) + 1;
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
        return { labels: sorted.map(e => e[0]), values: sorted.map(e => e[1]) };
      })
    );
  }

  readonly dateFilterOptions = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Year to Date'];
  readonly cityFilterOptions = ['All Regions', 'Marrakech-Safi', 'Fes-Meknes', 'Tangier-Tetouan'];
}
