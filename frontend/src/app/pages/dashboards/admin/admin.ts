import {
  AfterViewInit, Component, ElementRef, OnDestroy, OnInit,
  CUSTOM_ELEMENTS_SCHEMA, ViewChild, inject, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import {
  AdminService, ClientUser, GuideUser, ArtisanUser, DmcUser,
  ReservationItem, AdminUser, PlatformStats
} from '../../../services/admin.service';
import { PlatformUser, ToastType, UserRole, UserStatus } from './platform-user.model';

import 'iconify-icon';

Chart.register(...registerables);

function toDateStr(raw: string | null | undefined): string {
  if (!raw) return '—';
  try { return raw.split('T')[0]; } catch { return raw; }
}

function avatarFor(id: number, gender: 'men' | 'women' = 'men'): string {
  return `https://randomuser.me/api/portraits/${gender}/${(id % 90) + 1}.jpg`;
}

@Component({
  standalone: true,
  selector: 'app-super-admin-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class admin implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('growthChart')      private growthChartRef?:      ElementRef<HTMLCanvasElement>;
  @ViewChild('destinationChart') private destinationChartRef?: ElementRef<HTMLCanvasElement>;
  private growthChart?:      Chart;
  private destinationChart?: Chart;
  private toastTimeoutId?: ReturnType<typeof setTimeout>;

  private svc = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  // ── Loading flags (one per tab for instant paint) ─────────────────────────
  loadingStats  = true;
  loadingUsers  = true;
  loadingGuides = false;
  loadingArtisans = false;
  loadingReservations = false;

  // ── KPI stats from /admins/stats (fast single query) ─────────────────────
  stats: PlatformStats = {
    totalClients: 0, totalGuides: 0, totalArtisans: 0,
    totalDmcs: 0, totalAdmins: 0, totalReservations: 0,
    reservationsConfirmees: 0, reservationsEnAttente: 0,
    guidesDisponibles: 0, artisansEligiblesExport: 0
  };
  get totalUsers() {
    return this.stats.totalClients + this.stats.totalGuides +
           this.stats.totalArtisans + this.stats.totalDmcs + this.stats.totalAdmins;
  }

  // ── Raw lists loaded lazily per tab ───────────────────────────────────────
  clients:      ClientUser[]      = [];
  guides:       GuideUser[]       = [];
  artisans:     ArtisanUser[]     = [];
  dmcs:         DmcUser[]         = [];
  reservations: ReservationItem[] = [];
  admins:       AdminUser[]       = [];
  users:        PlatformUser[]    = [];

  // ── Tab ───────────────────────────────────────────────────────────────────
  activeTab: 'users' | 'guides' | 'artisans' | 'reservations' | 'analytics' = 'users';

  // ── Toast ─────────────────────────────────────────────────────────────────
  toastMessage = ''; toastType: ToastType = 'success'; toastVisible = false;

  // ── Search / filter ───────────────────────────────────────────────────────
  searchQuery = '';
  filterRole: UserRole | 'All' = 'All';
  roleOptions: (UserRole | 'All')[] = ['All', 'Client', 'Guide', 'Artisan', 'DMC', 'Administrator'];

  // ── Modal state ───────────────────────────────────────────────────────────
  showModal  = false;
  modalMode: 'add' | 'edit' = 'add';
  modalSaving = false;
  currentUser: PlatformUser | null = null;

  // ── Confirm dialog state ─────────────────────────────────────────────────
  showConfirm = false;
  confirmMessage = '';
  confirmAction: (() => void) | null = null;

  // shared fields
  fNom = ''; fPrenom = ''; fEmail = ''; fPassword = '';
  fTelephone = ''; fNationalite = ''; fLangue = '';
  fRole: UserRole = 'Client'; fStatus: UserStatus = 'Active';
  // role-specific
  fTier = ''; fLicence = ''; fStatutCert = 'EN_ATTENTE';
  fDisponible = true; fCategorie = ''; fExport = false;
  fIndependant = true; fEntreprise = ''; fZone = '';
  fAdminRole = 'ADMIN';

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.svc.getStats().subscribe({
      next: s => { this.stats = s; this.loadingStats = false; this.cdr.markForCheck(); },
      error: () => { this.loadingStats = false; this.cdr.markForCheck(); }
    });
    this.loadUserTab();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.growthChart?.destroy();
    this.destinationChart?.destroy();
    if (this.toastTimeoutId) clearTimeout(this.toastTimeoutId);
  }

  // ── Lazy tab loading ──────────────────────────────────────────────────────

  switchTab(tab: typeof this.activeTab): void {
    this.activeTab = tab;
    if (tab === 'users'        && !this.users.length)        this.loadUserTab();
    if (tab === 'guides'       && !this.guides.length)       this.loadGuideTab();
    if (tab === 'artisans'     && !this.artisans.length)     this.loadArtisanTab();
    if (tab === 'reservations' && !this.reservations.length) this.loadReservationTab();
    if (tab === 'analytics')   setTimeout(() => this.refreshCharts(), 60);
  }

  private loadUserTab(): void {
    this.loadingUsers = true;
    this.svc.getClients().subscribe(r => { this.clients = r; this.rebuildUsers(); this.cdr.markForCheck(); });
    this.svc.getGuides().subscribe(r => { this.guides = r; this.rebuildUsers(); this.cdr.markForCheck(); });
    this.svc.getArtisans().subscribe(r => { this.artisans = r; this.rebuildUsers(); this.cdr.markForCheck(); });
    this.svc.getDmcs().subscribe(r => { this.dmcs = r; this.rebuildUsers(); this.cdr.markForCheck(); });
    this.svc.getAdmins().subscribe(r => {
      this.admins = r; this.rebuildUsers();
      this.loadingUsers = false;
      this.cdr.markForCheck();
    });
  }

  private loadGuideTab(): void {
    this.loadingGuides = true;
    this.svc.getGuides().subscribe(r => { this.guides = r; this.loadingGuides = false; this.cdr.markForCheck(); });
  }

  private loadArtisanTab(): void {
    this.loadingArtisans = true;
    this.svc.getArtisans().subscribe(r => { this.artisans = r; this.loadingArtisans = false; this.cdr.markForCheck(); });
  }

  private loadReservationTab(): void {
    this.loadingReservations = true;
    this.svc.getReservations().subscribe(r => {
      this.reservations = r; this.loadingReservations = false; this.cdr.markForCheck();
    });
    if (!this.clients.length)  this.svc.getClients().subscribe(r => { this.clients = r; this.cdr.markForCheck(); });
    if (!this.guides.length)   this.svc.getGuides().subscribe(r => { this.guides = r; this.cdr.markForCheck(); });
  }

  private rebuildUsers(): void {
    this.users = [
      ...this.clients.map(c  => this.clientToUser(c)),
      ...this.guides.map(g   => this.guideToUser(g)),
      ...this.artisans.map(a => this.artisanToUser(a)),
      ...this.dmcs.map(d     => this.dmcToUser(d)),
      ...this.admins.map(a   => this.adminToUser(a)),
    ];
  }

  // ── Entity mappers ────────────────────────────────────────────────────────

  private clientToUser(c: ClientUser): PlatformUser {
    const status: UserStatus = c.status === 'SUSPENDED' ? 'Suspended' : 'Active';
    return { id: +c.id, name: `${c.prenom} ${c.nom}`.trim(), role: 'Client', email: c.email,
      date: toDateStr(c.dateCreation), status, rating: null,
      country: c.nationalite ?? '—', language: c.languePreferee ?? '—',
      avatar: avatarFor(+c.id), telephone: c.telephone, tierAbonnement: c.tierAbonnement };
  }
  private guideToUser(g: GuideUser): PlatformUser {
    const status: UserStatus = g.status === 'SUSPENDED' ? 'Suspended' :
      g.statutCertification === 'CERTIFIE' ? 'Certified' : 'Active';
    return { id: +g.id, name: `${g.prenom} ${g.nom}`.trim(), role: 'Guide', email: g.email,
      date: toDateStr(g.dateCreation), status, rating: g.scoreCertification ?? null,
      country: g.nationalite ?? '—', language: g.languePreferee ?? '—',
      avatar: avatarFor(+g.id), telephone: g.telephone,
      numeroLicence: g.numeroLicence, statutCertification: g.statutCertification, disponible: g.disponible };
  }
  private artisanToUser(a: ArtisanUser): PlatformUser {
    const status: UserStatus = a.status === 'SUSPENDED' ? 'Suspended' : 'Active';
    return { id: +a.id, name: `${a.prenom} ${a.nom}`.trim(), role: 'Artisan', email: a.email,
      date: toDateStr(a.dateCreation), status, rating: null,
      country: a.nationalite ?? '—', language: a.languePreferee ?? '—',
      avatar: a.avatarUrl ?? avatarFor(+a.id, 'women'), telephone: a.telephone,
      categorieArtisanat: a.categorieArtisanat, eligibleExport: a.eligibleExport,
      independant: a.independant, cooperativeId: a.cooperativeId };
  }
  private dmcToUser(d: DmcUser): PlatformUser {
    const status: UserStatus = d.status === 'SUSPENDED' ? 'Suspended' : 'Active';
    return { id: +d.id, name: d.nomEntreprise || `${d.prenom} ${d.nom}`.trim(), role: 'DMC', email: d.email,
      date: toDateStr(d.dateCreation), status, rating: null,
      country: d.nationalite ?? '—', language: d.languePreferee ?? '—',
      avatar: avatarFor(+d.id), telephone: d.telephone,
      nomEntreprise: d.nomEntreprise, zoneCouverture: d.zoneCouverture };
  }
  private adminToUser(a: AdminUser): PlatformUser {
    const status: UserStatus = a.status === 'SUSPENDED' ? 'Suspended' : 'Active';
    return { id: +a.id, name: `${a.prenom} ${a.nom}`.trim(), role: 'Administrator', email: a.email,
      date: toDateStr(a.dateCreation), status, rating: null,
      country: a.nationalite ?? '—', language: a.languePreferee ?? '—',
      avatar: avatarFor(+a.id), telephone: a.telephone };
  }

  // ── Computed getters ──────────────────────────────────────────────────────

  get filteredUsers(): PlatformUser[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.users.filter(u =>
      (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (this.filterRole === 'All' || u.role === this.filterRole)
    );
  }
  get totalClients()   { return this.stats.totalClients; }
  get totalGuides()    { return this.stats.totalGuides; }
  get totalArtisans()  { return this.stats.totalArtisans; }
  get totalDmcs()      { return this.stats.totalDmcs; }
  get totalReservations() { return this.stats.totalReservations; }
  get certifiedGuides()   { return this.guides.filter(g => g.statutCertification === 'CERTIFIE'); }
  get availableGuides()   { return this.guides.filter(g => g.disponible); }
  get confirmedRes()      { return this.reservations.filter(r => r.statut === 'CONFIRMEE'); }
  get confirmedReservations() { return this.confirmedRes; }
  get pendingRes()        { return this.reservations.filter(r => r.statut === 'EN_ATTENTE'); }
  get pendingReservations() { return this.pendingRes; }

  trackUser(_: number, u: PlatformUser): number   { return u.id; }
  trackGuide(_: number, g: GuideUser): number     { return +g.id; }
  trackArtisan(_: number, a: ArtisanUser): number { return +a.id; }
  trackRes(_: number, r: ReservationItem): number { return +r.id; }

  handleSearch(v: string): void    { this.searchQuery = v; }
  handleRoleFilter(v: UserRole | 'All'): void { this.filterRole = v; }

  // ── Toast ─────────────────────────────────────────────────────────────────

  showNotification(message: string, type: ToastType = 'success'): void {
    this.toastMessage = message;
    this.toastType    = type;
    this.toastVisible = true;
    if (this.toastTimeoutId) clearTimeout(this.toastTimeoutId);
    this.toastTimeoutId = setTimeout(() => { this.toastVisible = false; }, 3500);
  }

  private notify(message: string, type: ToastType = 'success'): void {
    this.showNotification(message, type);
  }

  getClientName(id: number | null): string {
    if (!id) return '—';
    const c = this.clients.find(c => +c.id === id);
    return c ? `${c.prenom} ${c.nom}`.trim() : `Client #${id}`;
  }
  getGuideName(id: number | null): string {
    if (!id) return '—';
    const g = this.guides.find(g => +g.id === id);
    return g ? `${g.prenom} ${g.nom}`.trim() : `Guide #${id}`;
  }
  reservationStatusClass(s: string): Record<string, boolean> {
    return {
      'bg-emerald-100 text-emerald-800': s === 'CONFIRMEE',
      'bg-amber-100 text-amber-800':     s === 'EN_ATTENTE',
      'bg-red-100 text-red-800':         s === 'ANNULEE',
      'bg-muted text-muted-foreground':  !['CONFIRMEE','EN_ATTENTE','ANNULEE'].includes(s),
    };
  }

  // ── Modal open/close ──────────────────────────────────────────────────────

  openModal(mode: 'add' | 'edit', user?: PlatformUser): void {
    this.modalMode = mode;
    this.currentUser = user ?? null;
    this.showModal = true;
    this.modalSaving = false;
    if (mode === 'edit' && user) {
      this.fNom = user.name.split(' ').slice(1).join(' ');
      this.fPrenom = user.name.split(' ')[0];
      this.fEmail = user.email;
      this.fPassword = '';
      this.fTelephone = user.telephone ?? '';
      this.fNationalite = user.country !== '—' ? user.country : '';
      this.fLangue = user.language !== '—' ? user.language : '';
      this.fRole = user.role;
      this.fStatus = user.status;
      // role-specific
      this.fTier        = user.tierAbonnement ?? '';
      this.fLicence     = user.numeroLicence ?? '';
      this.fStatutCert  = user.statutCertification ?? 'EN_ATTENTE';
      this.fDisponible  = user.disponible ?? true;
      this.fCategorie   = user.categorieArtisanat ?? '';
      this.fExport      = user.eligibleExport ?? false;
      this.fIndependant = user.independant ?? true;
      this.fEntreprise  = user.nomEntreprise ?? '';
      this.fZone        = user.zoneCouverture ?? '';
    } else {
      this.fNom = ''; this.fPrenom = ''; this.fEmail = ''; this.fPassword = '';
      this.fTelephone = ''; this.fNationalite = ''; this.fLangue = '';
      this.fRole = 'Client'; this.fStatus = 'Active';
      this.fTier = ''; this.fLicence = ''; this.fStatutCert = 'EN_ATTENTE';
      this.fDisponible = true; this.fCategorie = ''; this.fExport = false;
      this.fIndependant = true; this.fEntreprise = ''; this.fZone = '';
      this.fAdminRole = 'ADMIN';
    }
  }

  closeModal(): void { this.showModal = false; this.currentUser = null; }

  get modalTitle(): string { return this.modalMode === 'edit' ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'; }

  submitModal(): void {
    if (this.modalSaving) return;
    this.modalSaving = true;
    if (this.modalMode === 'edit' && this.currentUser) {
      this.doUpdate(this.currentUser);
    } else {
      this.doCreate();
    }
  }

  // ── Create ────────────────────────────────────────────────────────────────

  private doCreate(): void {
    const base = { email: this.fEmail, password: this.fPassword,
      nom: this.fNom, prenom: this.fPrenom, telephone: this.fTelephone,
      nationalite: this.fNationalite, languePreferee: this.fLangue };

    let call$: any;
    switch (this.fRole) {
      case 'Client':
        call$ = this.svc.createClient({ ...base, tierAbonnement: this.fTier || null });
        break;
      case 'Guide':
        call$ = this.svc.createGuide({ ...base, numeroLicence: this.fLicence });
        break;
      case 'Artisan':
        call$ = this.svc.createArtisan({ ...base, categorieArtisanat: this.fCategorie,
          eligibleExport: this.fExport, independant: this.fIndependant });
        break;
      case 'DMC':
        call$ = this.svc.createDmc({ ...base, nomEntreprise: this.fEntreprise, zoneCouverture: this.fZone });
        break;
      case 'Administrator':
        call$ = this.svc.createAdmin({ ...base, role: this.fAdminRole });
        break;
      default:
        this.notify('Rôle inconnu.', 'error'); this.modalSaving = false; return;
    }

    call$.subscribe({
      next: () => {
        this.notify('Utilisateur créé avec succès.');
        this.closeModal();
        this.refreshAfterCrud();
      },
      error: (e: any) => {
        this.notify(e?.error?.message ?? 'Erreur lors de la création.', 'error');
        this.modalSaving = false;
      }
    });
  }

  // ── Update ────────────────────────────────────────────────────────────────

  private doUpdate(user: PlatformUser): void {
    const base = { nom: this.fNom, prenom: this.fPrenom, telephone: this.fTelephone,
      nationalite: this.fNationalite, languePreferee: this.fLangue };

    let call$: any;
    switch (user.role) {
      case 'Client':
        call$ = this.svc.updateClient(user.id, base);
        break;
      case 'Guide':
        call$ = this.svc.updateGuide(user.id, { ...base, numeroLicence: this.fLicence,
          statutCertification: this.fStatutCert, disponible: this.fDisponible });
        break;
      case 'Artisan':
        call$ = this.svc.updateArtisan(user.id, { ...base, categorieArtisanat: this.fCategorie,
          eligibleExport: this.fExport, independant: this.fIndependant });
        break;
      case 'DMC':
        call$ = this.svc.updateDmc(user.id, { nomEntreprise: this.fEntreprise, zoneCouverture: this.fZone });
        break;
      case 'Administrator':
        call$ = this.svc.updateAdmin(user.id, base);
        break;
      default:
        this.notify('Rôle inconnu.', 'error'); this.modalSaving = false; return;
    }

    call$.subscribe({
      next: () => {
        this.notify('Utilisateur mis à jour.');
        this.closeModal();
        this.modalSaving = false;
        // Optimistic update: refresh the local user list in background
        this.refreshAfterCrud();
      },
      error: (e: any) => {
        this.notify(e?.error?.message ?? 'Erreur lors de la mise à jour.', 'error');
        this.modalSaving = false;
      }
    });
  }

  // ── Confirm dialog ───────────────────────────────────────────────────────

  requestConfirm(message: string, action: () => void): void {
    this.confirmMessage = message;
    this.confirmAction = action;
    this.showConfirm = true;
  }

  confirmOk(): void {
    this.showConfirm = false;
    this.confirmAction?.();
    this.confirmAction = null;
  }

  confirmCancel(): void {
    this.showConfirm = false;
    this.confirmAction = null;
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  deleteUser(userId: number, role: UserRole): void {
    this.requestConfirm('Supprimer définitivement cet utilisateur ?', () => {
      const call$: any = {
        'Client': () => this.svc.deleteClient(userId),
        'Guide': () => this.svc.deleteGuide(userId),
        'Artisan': () => this.svc.deleteArtisan(userId),
        'DMC': () => this.svc.deleteDmc(userId),
        'Administrator': () => this.svc.deleteAdmin(userId),
      }[role]?.();
      if (!call$) { this.notify('Rôle inconnu.', 'error'); return; }
      call$.subscribe({
        next: () => { this.notify('Utilisateur supprimé.', 'error'); this.refreshAfterCrud(); },
        error: () => this.notify('Erreur de suppression.', 'error')
      });
    });
  }

  deleteGuideById(id: number): void {
    this.requestConfirm('Supprimer ce guide ?', () => {
      this.svc.deleteGuide(id).subscribe({
        next: () => { this.notify('Guide supprimé.', 'error'); this.loadGuideTab(); this.rebuildUsers(); },
        error: () => this.notify('Erreur de suppression.', 'error')
      });
    });
  }

  deleteArtisanById(id: number): void {
    this.requestConfirm('Supprimer cet artisan ?', () => {
      this.svc.deleteArtisan(id).subscribe({
        next: () => { this.notify('Artisan supprimé.', 'error'); this.loadArtisanTab(); this.rebuildUsers(); },
        error: () => this.notify('Erreur de suppression.', 'error')
      });
    });
  }

  deleteReservationById(id: number): void {
    this.requestConfirm('Supprimer cette réservation ?', () => {
      this.svc.deleteReservation(id).subscribe({
        next: () => { this.notify('Réservation supprimée.', 'error'); this.loadReservationTab(); },
        error: () => this.notify('Erreur de suppression.', 'error')
      });
    });
  }

  toggleUserStatus(userId: number): void {
    const u = this.users.find(u => u.id === userId);
    if (!u) return;
    const newStatus: UserStatus = (u.status === 'Active' || u.status === 'Certified') ? 'Suspended' : 'Active';
    const backendStatus = newStatus === 'Suspended' ? 'SUSPENDED' : 'ENABLED';

    let call$: any;
    switch (u.role) {
      case 'Client':      call$ = this.svc.updateClient(userId, { status: backendStatus }); break;
      case 'Guide':       call$ = this.svc.updateGuide(userId, { status: backendStatus }); break;
      case 'Artisan':     call$ = this.svc.updateArtisan(userId, { status: backendStatus }); break;
      case 'DMC':         call$ = this.svc.updateDmc(userId, { status: backendStatus }); break;
      case 'Administrator': call$ = this.svc.updateAdmin(userId, { status: backendStatus }); break;
      default: return;
    }

    call$.subscribe({
      next: () => {
        u.status = newStatus;
        this.notify(`Statut changé en ${newStatus}.`);
        this.cdr.markForCheck();
      },
      error: () => this.notify('Erreur lors du changement de statut.', 'error')
    });
  }

  // ── Refresh after a write operation ───────────────────────────────────────

  private refreshAfterCrud(): void {
    this.svc.getStats().subscribe(s => this.stats = s);
    this.loadUserTab();
    if (this.activeTab === 'guides')       this.loadGuideTab();
    if (this.activeTab === 'artisans')     this.loadArtisanTab();
    if (this.activeTab === 'reservations') this.loadReservationTab();
  }

  // ── Charts ─────────────────────────────────────────────────────────────────

  private refreshCharts(): void {
    if (!this.growthChartRef || !this.destinationChartRef) return;

    const entityLabels = ['Clients', 'Guides', 'Artisans', 'DMCs', 'Admins'];
    const entityValues = [this.stats.totalClients, this.stats.totalGuides, this.stats.totalArtisans, this.stats.totalDmcs, this.stats.totalAdmins];

    if (this.growthChart) {
      this.growthChart.data.labels = entityLabels;
      this.growthChart.data.datasets[0].data = entityValues;
      this.growthChart.update();
    } else {
      this.growthChart = new Chart(this.growthChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: entityLabels,
          datasets: [{
            label: 'Utilisateurs',
            data: entityValues,
            backgroundColor: ['#B34724', '#2C5234', '#D4AF37', '#6E655F', '#5B8DB8'],
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
      });
    }

    const statuts = this.reservations.reduce((acc: Record<string, number>, r) => {
      acc[r.statut ?? 'INCONNU'] = (acc[r.statut ?? 'INCONNU'] ?? 0) + 1;
      return acc;
    }, {});
    const sLabels = Object.keys(statuts);
    const sValues = Object.values(statuts);

    if (this.destinationChart) {
      this.destinationChart.data.labels = sLabels.length ? sLabels : ['Aucune réservation'];
      this.destinationChart.data.datasets[0].data = sValues.length ? sValues : [0];
      this.destinationChart.update();
    } else {
      this.destinationChart = new Chart(this.destinationChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: sLabels.length ? sLabels : ['Aucune réservation'],
          datasets: [{ data: sValues.length ? sValues : [1],
            backgroundColor: ['#B34724', '#2C5234', '#D4AF37', '#6E655F', '#5B8DB8'] }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      });
    }
  }
}
