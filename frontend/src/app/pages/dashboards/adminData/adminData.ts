import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import {
  AdminDataService,
  DashboardMetrics,
  ChartSeriesData,
  ClientDTO,
  GuideDTO,
  ArtisanDTO,
  DmcDTO,
  ReservationDTO
} from './admin-data.service';
import { ToastType } from './platform-user.model';

import 'iconify-icon';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-admin-data-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './adminData.html',
  styleUrls: ['./adminData.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class adminData implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('growthChart')      private growthChartRef?:      ElementRef<HTMLCanvasElement>;
  @ViewChild('destinationChart') private destinationChartRef?: ElementRef<HTMLCanvasElement>;

  private growthChart?:      Chart;
  private destinationChart?: Chart;
  private toastTimeoutId?:   ReturnType<typeof setTimeout>;

  private adminDataService = inject(AdminDataService);

  // ── Loading ──────────────────────────────────────────────────────────────
  isLoading = false;

  // ── KPI metrics ──────────────────────────────────────────────────────────
  metrics: DashboardMetrics = {
    totalUsers: 0, totalClients: 0, totalGuides: 0,
    totalArtisans: 0, totalDmcs: 0, totalReservations: 0,
    reservationsConfirmees: 0, reservationsEnAttente: 0,
    guidesDisponibles: 0, artisansEligiblesExport: 0
  };

  // ── Chart data ────────────────────────────────────────────────────────────
  originBreakdown:   ChartSeriesData = { labels: [], values: [] };
  categoryBreakdown: ChartSeriesData = { labels: [], values: [] };

  // ── Raw lists for detail panels ───────────────────────────────────────────
  guides:       GuideDTO[]       = [];
  artisans:     ArtisanDTO[]     = [];
  reservations: ReservationDTO[] = [];
  clients:      ClientDTO[]      = [];
  dmcs:         DmcDTO[]         = [];

  // ── Filter state ──────────────────────────────────────────────────────────
  activeFilterDate = 'Last 30 Days';
  activeFilterCity = 'All Regions';

  readonly dateFilterOptions = this.adminDataService.dateFilterOptions;
  readonly cityFilterOptions = this.adminDataService.cityFilterOptions;

  // ── Toast ─────────────────────────────────────────────────────────────────
  toastMessage = '';
  toastType: ToastType = 'success';
  toastVisible = false;

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.showNotification('Portail Analytique initialisé.'), 800);
  }

  ngOnDestroy(): void {
    this.growthChart?.destroy();
    this.destinationChart?.destroy();
    if (this.toastTimeoutId) clearTimeout(this.toastTimeoutId);
  }

  // ── Data loading ──────────────────────────────────────────────────────────

  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      metrics:  this.adminDataService.getSummaryMetrics(),
      entities: this.adminDataService.getAllEntities(),
    }).subscribe({
      next: ({ metrics, entities }) => {
        this.metrics   = metrics;
        this.clients   = entities.clients;
        this.guides    = entities.guides;
        this.artisans  = entities.artisans;
        this.reservations = entities.reservations;
        this.dmcs      = entities.dmcs;

        this.originBreakdown   = this.buildBreakdown(this.clients, 'nationalite');
        this.categoryBreakdown = this.buildBreakdown(this.artisans, 'categorieArtisanat');

        this.isLoading = false;
        setTimeout(() => { this.updateGrowthChart(); this.updateDestinationChart(); }, 50);
      },
      error: err => {
        console.error('Analytics load failed', err);
        this.showNotification('Erreur de chargement des données.', 'error');
        this.isLoading = false;
      }
    });
  }

  private buildBreakdown(items: object[], field: string): ChartSeriesData {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      const key = ((item as Record<string, unknown>)[field] as string) || 'Non spécifié';
      counts[key] = (counts[key] ?? 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return { labels: sorted.map(e => e[0]), values: sorted.map(e => e[1]) };
  }

  // ── Filter handlers ───────────────────────────────────────────────────────

  changeDateFilter(range: string): void {
    this.activeFilterDate = range;
    this.showNotification(`Plage mise à jour : ${range}`);
    // Re-load so service re-computes from live data
    this.loadDashboardData();
  }

  changeCityFilter(city: string): void {
    this.activeFilterCity = city;
    this.showNotification(`Région : ${city}`);
    this.loadDashboardData();
  }

  // ── Export (simulated — real export would call a backend endpoint) ─────────

  exportReport(format: string): void {
    this.showNotification(`Préparation export ${format}...`);
    setTimeout(() => this.showNotification(`Export ${format} prêt.`), 1500);
  }

  // ── Toast ─────────────────────────────────────────────────────────────────

  showNotification(message: string, type: ToastType = 'success'): void {
    this.toastMessage = message;
    this.toastType    = type;
    this.toastVisible = true;
    if (this.toastTimeoutId) clearTimeout(this.toastTimeoutId);
    this.toastTimeoutId = setTimeout(() => { this.toastVisible = false; }, 3500);
  }

  // ── Computed helpers ──────────────────────────────────────────────────────

  get topGuidesByScore(): GuideDTO[] {
    return [...this.guides]
      .filter(g => g.scoreCertification != null)
      .sort((a, b) => (b.scoreCertification ?? 0) - (a.scoreCertification ?? 0))
      .slice(0, 5);
  }

  get topArtisanCategories(): { label: string; count: number }[] {
    const counts: Record<string, number> = {};
    this.artisans.forEach(a => {
      const c = a.categorieArtisanat || 'Autre';
      counts[c] = (counts[c] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, count]) => ({ label, count }));
  }

  get reservationByStatus(): { statut: string; count: number; pct: number }[] {
    const counts: Record<string, number> = {};
    this.reservations.forEach(r => {
      const s = r.statut ?? 'INCONNU';
      counts[s] = (counts[s] ?? 0) + 1;
    });
    const total = this.reservations.length || 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([statut, count]) => ({ statut, count, pct: Math.round((count / total) * 100) }));
  }

  get topClientNationalities(): { label: string; count: number }[] {
    const counts: Record<string, number> = {};
    this.clients.forEach(c => {
      const n = c.nationalite || 'Non spécifié';
      counts[n] = (counts[n] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, count]) => ({ label, count }));
  }

  trackByLabel(_: number, item: { label: string }): string { return item.label; }
  trackByStatut(_: number, item: { statut: string }): string { return item.statut; }

  // ── Charts ─────────────────────────────────────────────────────────────────

  private updateGrowthChart(): void {
    const data  = this.originBreakdown;
    const labels = data.labels.length ? data.labels : ['Aucune donnée'];
    const values = data.values.length ? data.values : [0];

    if (this.growthChart) {
      this.growthChart.data.labels = labels;
      this.growthChart.data.datasets[0].data = values;
      this.growthChart.update();
    } else if (this.growthChartRef) {
      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Clients par nationalité',
            data: values,
            backgroundColor: ['#B34724','#2C5234','#D4AF37','#6E655F','#5B8DB8','#9B59B6'],
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#EADEC933' } },
            x: { grid: { display: false } }
          }
        }
      };
      this.growthChart = new Chart(this.growthChartRef.nativeElement, config);
    }
  }

  private updateDestinationChart(): void {
    const data   = this.categoryBreakdown;
    const labels = data.labels.length ? data.labels : ['Aucune donnée'];
    const values = data.values.length ? data.values : [1];

    if (this.destinationChart) {
      this.destinationChart.data.labels = labels;
      this.destinationChart.data.datasets[0].data = values;
      this.destinationChart.update();
    } else if (this.destinationChartRef) {
      const config: ChartConfiguration<'doughnut'> = {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: ['#B34724','#2C5234','#D4AF37','#6E655F','#5B8DB8','#9B59B6']
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      };
      this.destinationChart = new Chart(this.destinationChartRef.nativeElement, config);
    }
  }
}
