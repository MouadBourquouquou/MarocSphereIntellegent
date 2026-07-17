import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  computed,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../../services/auth.service';
import {
  AdminService,
  ClientUser,
  GuideUser,
  ArtisanUser,
  DmcUser,
  ReservationItem,
} from '../../services/admin.service';
import { forkJoin } from 'rxjs';

export type ActiveTab = 'clients' | 'guides' | 'artisans' | 'dmcs' | 'reservations';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class admin implements OnInit, AfterViewInit {
  private adminService = inject(AdminService);
  private authService  = inject(AuthService);

  // ── State ──────────────────────────────────────────────────────────────
  activeTab   = signal<ActiveTab>('clients');
  isLoading   = signal(false);
  errorMsg    = signal('');
  successMsg  = signal('');

  clients      = signal<ClientUser[]>([]);
  guides       = signal<GuideUser[]>([]);
  artisans     = signal<ArtisanUser[]>([]);
  dmcs         = signal<DmcUser[]>([]);
  reservations = signal<ReservationItem[]>([]);

  // ── Stats cards (computed from real data) ──────────────────────────────
  totalClients      = computed(() => this.clients().length);
  totalGuides       = computed(() => this.guides().length);
  totalArtisans     = computed(() => this.artisans().length);
  totalDmcs         = computed(() => this.dmcs().length);
  totalReservations = computed(() => this.reservations().length);

  pendingGuides   = computed(() => this.guides().filter(g => g.statutCertification === 'PENDING').length);

  // Current admin name from stored user
  adminEmail = computed(() => this.authService.currentUser()?.email ?? 'Admin');

  // ── Search / filter ────────────────────────────────────────────────────
  searchQuery = signal('');

  filteredClients = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q ? this.clients().filter(c =>
      `${c.nom} ${c.prenom} ${c.email}`.toLowerCase().includes(q)) : this.clients();
  });

  filteredGuides = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q ? this.guides().filter(g =>
      `${g.nom} ${g.prenom} ${g.email}`.toLowerCase().includes(q)) : this.guides();
  });

  filteredArtisans = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q ? this.artisans().filter(a =>
      `${a.nom} ${a.prenom} ${a.email} ${a.categorieArtisanat}`.toLowerCase().includes(q)) : this.artisans();
  });

  filteredDmcs = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q ? this.dmcs().filter(d =>
      `${d.nomEntreprise} ${d.email}`.toLowerCase().includes(q)) : this.dmcs();
  });

  filteredReservations = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q ? this.reservations().filter(r =>
      `${r.statut} ${r.id}`.toLowerCase().includes(q)) : this.reservations();
  });

  // ── Lifecycle ──────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadAll();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMonthlyVolumeChart();
      this.initBookingDistributionChart();
    }, 500);
  }

  // ── Data loading ───────────────────────────────────────────────────────
  loadAll(): void {
    this.isLoading.set(true);
    this.errorMsg.set('');

    forkJoin({
      clients:      this.adminService.getClients(),
      guides:       this.adminService.getGuides(),
      artisans:     this.adminService.getArtisans(),
      dmcs:         this.adminService.getDmcs(),
      reservations: this.adminService.getReservations(),
    }).subscribe({
      next: (data) => {
        this.clients.set(data.clients);
        this.guides.set(data.guides);
        this.artisans.set(data.artisans);
        this.dmcs.set(data.dmcs);
        this.reservations.set(data.reservations);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error?.message ?? 'Erreur lors du chargement des données.');
      },
    });
  }

  // ── Tab navigation ─────────────────────────────────────────────────────
  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
    this.searchQuery.set('');
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  // ── Delete helpers ─────────────────────────────────────────────────────
  private flash(msg: string): void {
    this.successMsg.set(msg);
    setTimeout(() => this.successMsg.set(''), 3000);
  }

  deleteClient(id: number): void {
    if (!confirm('Supprimer ce client ?')) return;
    this.adminService.deleteClient(id).subscribe({
      next: () => { this.clients.update(list => list.filter(c => c.id !== id)); this.flash('Client supprimé.'); },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Erreur suppression.'),
    });
  }

  deleteGuide(id: number): void {
    if (!confirm('Supprimer ce guide ?')) return;
    this.adminService.deleteGuide(id).subscribe({
      next: () => { this.guides.update(list => list.filter(g => g.id !== id)); this.flash('Guide supprimé.'); },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Erreur suppression.'),
    });
  }

  deleteArtisan(id: number): void {
    if (!confirm('Supprimer cet artisan ?')) return;
    this.adminService.deleteArtisan(id).subscribe({
      next: () => { this.artisans.update(list => list.filter(a => a.id !== id)); this.flash('Artisan supprimé.'); },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Erreur suppression.'),
    });
  }

  deleteDmc(id: number): void {
    if (!confirm('Supprimer ce DMC ?')) return;
    this.adminService.deleteDmc(id).subscribe({
      next: () => { this.dmcs.update(list => list.filter(d => d.id !== id)); this.flash('DMC supprimé.'); },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Erreur suppression.'),
    });
  }

  deleteReservation(id: number): void {
    if (!confirm('Supprimer cette réservation ?')) return;
    this.adminService.deleteReservation(id).subscribe({
      next: () => { this.reservations.update(list => list.filter(r => r.id !== id)); this.flash('Réservation supprimée.'); },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Erreur suppression.'),
    });
  }

  // ── Certification approval ─────────────────────────────────────────────
  approveGuide(id: number): void {
    // PATCH is not wired yet; optimistic update on the signal for now
    this.guides.update(list =>
      list.map(g => g.id === id ? { ...g, statutCertification: 'APPROVED' } : g)
    );
    this.flash('Guide approuvé.');
  }

  // ── Logout ─────────────────────────────────────────────────────────────
  logout(): void {
    this.authService.logout();
  }

  // ── Initials helper ────────────────────────────────────────────────────
  initials(nom: string, prenom: string): string {
    return `${(prenom?.[0] ?? '').toUpperCase()}${(nom?.[0] ?? '').toUpperCase()}`;
  }

  // ── Charts ─────────────────────────────────────────────────────────────
  private initMonthlyVolumeChart(): void {
    const ctx = document.getElementById('monthlyVolumeChart') as HTMLCanvasElement | null;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Clients',
            data: [0, 0, 0, 0, 0, this.totalClients()],
            borderColor: '#9D3E26',
            backgroundColor: 'rgba(157,62,38,0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Réservations',
            data: [0, 0, 0, 0, 0, this.totalReservations()],
            borderColor: '#1661A1',
            backgroundColor: 'rgba(22,97,161,0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: '#E3DFD5' }, ticks: { color: '#5A5C5E' } },
          x: { grid: { display: false }, ticks: { color: '#5A5C5E' } },
        },
      },
    });
  }

  private initBookingDistributionChart(): void {
    const ctx = document.getElementById('bookingDistributionChart') as HTMLCanvasElement | null;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Clients', 'Guides', 'Artisans', 'DMCs'],
        datasets: [{
          data: [
            this.totalClients(),
            this.totalGuides(),
            this.totalArtisans(),
            this.totalDmcs(),
          ],
          backgroundColor: ['#9D3E26', '#1661A1', '#E3DFD5', '#5A5C5E'],
          borderWidth: 2,
          borderColor: '#FFFFFF',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#2D2E30', font: { family: 'Inter' } } },
        },
      },
    });
  }
}
