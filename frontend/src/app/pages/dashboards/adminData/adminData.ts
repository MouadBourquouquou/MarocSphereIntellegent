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
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

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
import { AuthService } from '../../../services/auth.service';
import { ToastType } from './platform-user.model';

import 'iconify-icon';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-admin-data-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
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
  private auth = inject(AuthService);

  // ── Loading ──────────────────────────────────────────────────────────────
  isLoading = false;

  // ── Tab ──────────────────────────────────────────────────────────────────
  activeTab: 'overview' | 'nationalities' | 'guides' | 'reservations' | 'artisans' | 'filters' = 'overview';

  // ── Search ───────────────────────────────────────────────────────────────
  searchQuery = '';

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
    setTimeout(() => this.showNotification('Analytics portal initialized.'), 800);
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
        setTimeout(() => {
          if (this.activeTab === 'overview' || this.activeTab === 'nationalities') this.updateGrowthChart();
          if (this.activeTab === 'overview' || this.activeTab === 'artisans') this.updateDestinationChart();
        }, 50);
      },
      error: err => {
        console.error('Analytics load failed', err);
        this.showNotification('Error loading data.', 'error');
        this.isLoading = false;
      }
    });
  }

  private buildBreakdown(items: object[], field: string): ChartSeriesData {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      const key = ((item as Record<string, unknown>)[field] as string) || 'Unspecified';
      counts[key] = (counts[key] ?? 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return { labels: sorted.map(e => e[0]), values: sorted.map(e => e[1]) };
  }

  // ── Filter handlers ───────────────────────────────────────────────────────

  changeDateFilter(range: string): void {
    this.activeFilterDate = range;
    this.showNotification(`Date range updated: ${range}`);
    // Re-load so service re-computes from live data
    this.loadDashboardData();
  }

  changeCityFilter(city: string): void {
    this.activeFilterCity = city;
    this.showNotification(`Region: ${city}`);
    this.loadDashboardData();
  }

  // ── Export ───────────────────────────────────────────────────────────────

  exportReport(format: string): void {
    this.showNotification(`Preparing ${format} export...`);
    try {
      const wb = this.buildWorkbook();
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `marocsphere-analytics-${timestamp}`;

      if (format === 'CSV') {
        const ws = wb.Sheets[wb.SheetNames[0]];
        XLSX.writeFile(wb, `${filename}.csv`, { bookType: 'csv' });
      } else if (format === 'Excel') {
        XLSX.writeFile(wb, `${filename}.xlsx`);
      } else if (format === 'PDF') {
        this.generatePDF(filename);
      }
      this.showNotification(`Export ${format} downloaded.`);
    } catch {
      this.showNotification(`Export ${format} failed.`, 'error');
    }
  }

  private buildWorkbook(): XLSX.WorkBook {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ['MarocSphere Analytics Report'],
      ['Date', new Date().toLocaleDateString()],
      ['Region', this.activeFilterCity],
      ['Time Range', this.activeFilterDate],
      [],
      ['Metric', 'Value'],
      ['Total Users', this.metrics.totalUsers],
      ['Total Clients', this.metrics.totalClients],
      ['Total Guides', this.metrics.totalGuides],
      ['Total Artisans', this.metrics.totalArtisans],
      ['Total DMCs', this.metrics.totalDmcs],
      ['Total Reservations', this.metrics.totalReservations],
      ['Confirmed Reservations', this.metrics.reservationsConfirmees],
      ['Pending Reservations', this.metrics.reservationsEnAttente],
      ['Available Guides', this.metrics.guidesDisponibles],
      ['Export Eligible Artisans', this.metrics.artisansEligiblesExport],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    // Clients sheet
    if (this.clients.length) {
      const clientRows = this.clients.map(c => ({
        ID: c.id,
        Email: c.email,
        Name: `${c.prenom} ${c.nom}`,
        Phone: c.telephone,
        Nationality: c.nationalite,
        Language: c.languePreferee,
        'Registered': c.dateCreation
      }));
      const wsClients = XLSX.utils.json_to_sheet(clientRows);
      XLSX.utils.book_append_sheet(wb, wsClients, 'Clients');
    }

    // Guides sheet
    if (this.guides.length) {
      const guideRows = this.guides.map(g => ({
        ID: g.id,
        Email: g.email,
        Name: `${g.prenom} ${g.nom}`,
        Nationality: g.nationalite,
        Language: g.languePreferee,
        License: g.numeroLicence,
        Certification: g.statutCertification,
        Score: g.scoreCertification,
        Available: g.disponible ? 'Yes' : 'No',
        'Registered': g.dateCreation
      }));
      const wsGuides = XLSX.utils.json_to_sheet(guideRows);
      XLSX.utils.book_append_sheet(wb, wsGuides, 'Guides');
    }

    // Artisans sheet
    if (this.artisans.length) {
      const artisanRows = this.artisans.map(a => ({
        ID: a.id,
        Email: a.email,
        Name: `${a.prenom} ${a.nom}`,
        Nationality: a.nationalite,
        Language: a.languePreferee,
        Category: a.categorieArtisanat,
        'Export Eligible': a.eligibleExport ? 'Yes' : 'No',
        Independent: a.independant ? 'Yes' : 'No',
        'Cooperative ID': a.cooperativeId ?? '—',
        'Registered': a.dateCreation
      }));
      const wsArtisans = XLSX.utils.json_to_sheet(artisanRows);
      XLSX.utils.book_append_sheet(wb, wsArtisans, 'Artisans');
    }

    // Reservations sheet
    if (this.reservations.length) {
      const resRows = this.reservations.map(r => ({
        ID: r.id,
        'Client': r.clientName || `Client #${r.clientId}`,
        'Type': r.resourceType,
        'Ressource': r.resourceName,
        Status: r.statut,
        Date: r.date
      }));
      const wsRes = XLSX.utils.json_to_sheet(resRows);
      XLSX.utils.book_append_sheet(wb, wsRes, 'Reservations');
    }

    // Nationalities sheet
    if (this.topClientNationalities.length) {
      const natRows = this.topClientNationalities.map((n, i) => ({
        Rank: i + 1,
        Nationality: n.label,
        'Client Count': n.count,
        'Share (%)': this.clients.length ? +(n.count / this.clients.length * 100).toFixed(1) : 0
      }));
      const wsNat = XLSX.utils.json_to_sheet(natRows);
      XLSX.utils.book_append_sheet(wb, wsNat, 'Nationalities');
    }

    // Reservation Status sheet
    if (this.reservationByStatus.length) {
      const statRows = this.reservationByStatus.map(s => ({
        Status: s.statut,
        Count: s.count,
        'Percentage (%)': s.pct
      }));
      const wsStat = XLSX.utils.json_to_sheet(statRows);
      XLSX.utils.book_append_sheet(wb, wsStat, 'Reservation Status');
    }

    return wb;
  }

  private generatePDF(filename: string): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    const addLine = () => { y += 2; doc.setDrawColor(200); doc.line(20, y, pageWidth - 20, y); y += 6; };
    const addText = (text: string, size: number, isBold = false) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.text(text, 20, y);
      y += size * 0.5;
    };
    const addKV = (key: string, value: string | number) => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${key}:`, 20, y);
      doc.setFont('helvetica', 'bold');
      doc.text(String(value), 90, y);
      y += 5;
    };

    // Title
    addText('MarocSphere Analytics Report', 16, true);
    y += 2;
    addText(`Date: ${new Date().toLocaleDateString()}`, 9);
    addText(`Region: ${this.activeFilterCity}  |  Time Range: ${this.activeFilterDate}`, 9);
    addLine();

    // Summary
    addText('Platform Summary', 12, true);
    y += 2;
    addKV('Total Users', this.metrics.totalUsers);
    addKV('Total Clients', this.metrics.totalClients);
    addKV('Total Guides', this.metrics.totalGuides);
    addKV('Total Artisans', this.metrics.totalArtisans);
    addKV('Total DMCs', this.metrics.totalDmcs);
    addKV('Total Reservations', this.metrics.totalReservations);
    addKV('Confirmed Reservations', this.metrics.reservationsConfirmees);
    addKV('Pending Reservations', this.metrics.reservationsEnAttente);
    addKV('Available Guides', this.metrics.guidesDisponibles);
    addKV('Export Eligible Artisans', this.metrics.artisansEligiblesExport);
    addLine();

    // Reservation Status
    if (this.reservationByStatus.length) {
      if (y > 240) { doc.addPage(); y = 20; }
      addText('Reservation Status Breakdown', 12, true);
      y += 2;
      this.reservationByStatus.forEach(s => {
        addKV(s.statut, `${s.count} (${s.pct}%)`);
      });
      addLine();
    }

    // Top Nationalities
    if (this.topClientNationalities.length) {
      if (y > 240) { doc.addPage(); y = 20; }
      addText('Top Client Nationalities', 12, true);
      y += 2;
      this.topClientNationalities.forEach((n, i) => {
        const pct = this.clients.length ? (n.count / this.clients.length * 100).toFixed(1) : '0';
        addKV(`#${i + 1} ${n.label}`, `${n.count} clients (${pct}%)`);
      });
      addLine();
    }

    // Top Guides
    if (this.topGuidesByScore.length) {
      if (y > 240) { doc.addPage(); y = 20; }
      addText('Top Guides by Certification Score', 12, true);
      y += 2;
      this.topGuidesByScore.forEach((g, i) => {
        addKV(`#${i + 1} ${g.prenom} ${g.nom}`, `Score: ${g.scoreCertification ?? '—'}  |  ${g.disponible ? 'Available' : 'Unavailable'}`);
      });
      addLine();
    }

    // Artisan Categories
    if (this.topArtisanCategories.length) {
      if (y > 240) { doc.addPage(); y = 20; }
      addText('Artisan Categories', 12, true);
      y += 2;
      this.topArtisanCategories.forEach(c => {
        addKV(c.label, `${c.count} artisans`);
      });
    }

    doc.save(`${filename}.pdf`);
  }

  // ── Toast ─────────────────────────────────────────────────────────────────

  showNotification(message: string, type: ToastType = 'success'): void {
    this.toastMessage = message;
    this.toastType    = type;
    this.toastVisible = true;
    if (this.toastTimeoutId) clearTimeout(this.toastTimeoutId);
    this.toastTimeoutId = setTimeout(() => { this.toastVisible = false; }, 3500);
  }

  logout(): void { this.auth.logout(); }

  switchTab(tab: typeof this.activeTab): void {
    this.activeTab = tab;
    if (tab === 'overview' || tab === 'nationalities' || tab === 'artisans') {
      setTimeout(() => {
        if (tab === 'overview') {
          this.growthChart = undefined;
          this.destinationChart = undefined;
          this.updateGrowthChart();
          this.updateDestinationChart();
        }
        if (tab === 'nationalities') {
          this.growthChart = undefined;
          this.updateGrowthChart();
        }
        if (tab === 'artisans') {
          this.destinationChart = undefined;
          this.updateDestinationChart();
        }
      }, 60);
    }
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
      const c = a.categorieArtisanat || 'Other';
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
      const n = c.nationalite || 'Unspecified';
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
    const labels = data.labels.length ? data.labels : ['No data'];
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
            label: 'Clients by Nationality',
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
    const labels = data.labels.length ? data.labels : ['No data'];
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
