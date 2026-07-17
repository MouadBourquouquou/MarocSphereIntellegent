import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { AdminDataService, ChartSeriesData, DashboardMetrics } from './admin-data.service';
import { PlatformUser, ToastType, UserFormValue, UserRole } from './platform-user.model';

import 'iconify-icon';

Chart.register(...registerables);

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './adminData.html',
  styleUrls: ['./adminData.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class adminData implements AfterViewInit, OnDestroy {
  // Canvas refs — in the template, tag the two <canvas> elements with
  // #growthChart and #destinationChart instead of id="growthChart" / id="destinationChart".
  @ViewChild('growthChart') private growthChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('destinationChart') private destinationChartRef?: ElementRef<HTMLCanvasElement>;

  private growthChart?: Chart;
  private destinationChart?: Chart;
  private toastTimeoutId?: ReturnType<typeof setTimeout>;

  activeTab = 'users';

  users: PlatformUser[] = [];
  metrics: DashboardMetrics = {
    totalUsers: 0,
    certifiedGuides: 0,
    activeArtisans: 0,
    completedTrips: 0
  };
  originBreakdown: ChartSeriesData = { labels: [], values: [] };
  categoryBreakdown: ChartSeriesData = { labels: [], values: [] };
  dateFilterOptions: string[] = [];
  cityFilterOptions: string[] = [];
  isLoading = false;

  // Toast state — bind these in the template instead of calling getElementById.
  toastMessage = '';
  toastType: ToastType = 'success';
  toastVisible = false;

  showUserModal = false;
  modalMode: 'add' | 'edit' = 'add';
  currentUser: PlatformUser | null = null;

  searchQuery = '';
  filterRole: UserRole | 'All' = 'All';
  activeFilterDate = 'Last 30 Days';
  activeFilterCity = 'All Regions';

  constructor(private readonly adminDataService: AdminDataService) {}

  /**
   * Replaces renderUserTable(): instead of re-rendering an HTML string into a tbody,
   * the template does *ngFor over this getter, so it recomputes automatically
   * whenever users, searchQuery, or filterRole change.
   */
  get filteredUsers(): PlatformUser[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = this.filterRole === 'All' || user.role === this.filterRole;
      return matchesSearch && matchesRole;
    });
  }

  ngAfterViewInit(): void {
    this.loadDashboardData();

    setTimeout(() => {
      this.showNotification('Welcome back, Mohamed! Super Admin Portal initialized.');
    }, 1000);
  }

  ngOnDestroy(): void {
    this.growthChart?.destroy();
    this.destinationChart?.destroy();
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }
  }

  showNotification(message: string, type: ToastType = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }
    this.toastTimeoutId = setTimeout(() => {
      this.toastVisible = false;
    }, 3500);
  }

  changeDateFilter(range: string): void {
    this.activeFilterDate = range;
    this.loadDashboardData();
    this.showNotification(`Date range updated to ${range}`);
  }

  changeCityFilter(city: string): void {
    this.activeFilterCity = city;
    this.loadDashboardData();
    this.showNotification(`Region filter updated to ${city}`);
  }

  exportReport(format: string): void {
    const today = new Date().toLocaleDateString('en-GB');
    this.showNotification(`Preparing ${format} export...`);

    setTimeout(() => {
      this.showNotification(`Download ready: ${format} report for ${today}`);
    }, 1500);
  }

  /**
   * Original relied on event.currentTarget to toggle classes on the clicked tab button.
   * Prefer driving the active-tab styling from `activeTab` in the template instead, e.g.
   * [class.border-primary]="activeTab === 'users'" — this removes the need to touch the DOM.
   */
  switchTab(tabId: string): void {
    this.activeTab = tabId;
    this.showNotification(`Switched to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)} Management view`);
  }

  openUserModal(mode: 'add' | 'edit', userId: number | null = null): void {
    this.modalMode = mode;
    this.currentUser = mode === 'edit' ? this.users.find(u => u.id === userId) ?? null : null;
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.currentUser = null;
  }

  /** Bind the modal form to a reactive/template-driven form and pass its value here on submit. */
  saveUser(formValue: UserFormValue): void {
    if (this.currentUser) {
      const user = this.users.find(u => u.id === this.currentUser!.id);
      if (user) {
        user.name = formValue.name;
        user.email = formValue.email;
        user.role = formValue.role;
        user.status = formValue.status;
        user.language = formValue.language;
      }
      this.showNotification('User profile updated successfully');
    } else {
      const newUser: PlatformUser = {
        id: Date.now(),
        name: formValue.name,
        role: formValue.role,
        email: formValue.email,
        date: new Date().toISOString().split('T')[0],
        status: formValue.status,
        rating: 5.0,
        country: 'Morocco',
        language: formValue.language,
        avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 90 + 1)}.jpg`
      };
      this.users.unshift(newUser);
      this.showNotification('New user registered successfully');
    }

    this.closeUserModal();
  }

  deleteUser(userId: number): void {
    const confirmed = confirm('Are you sure you want to permanently delete this user? This action cannot be undone.');
    if (!confirmed) {
      return;
    }
    this.users = this.users.filter(u => u.id !== userId);
    this.showNotification('User account deleted', 'error');
  }

  toggleUserStatus(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return;
    }
    user.status = user.status === 'Active' || user.status === 'Certified' ? 'Suspended' : 'Active';
    this.showNotification(`User status changed to ${user.status}`);
  }

  handleSearch(value: string): void {
    this.searchQuery = value;
  }

  handleRoleFilter(value: UserRole | 'All'): void {
    this.filterRole = value;
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    this.adminDataService.getUsers().subscribe(users => {
      this.users = users;
    });

    this.adminDataService.getDateFilterOptions().subscribe(options => {
      this.dateFilterOptions = options;
    });

    this.adminDataService.getCityFilterOptions().subscribe(options => {
      this.cityFilterOptions = options;
    });

    this.adminDataService.getSummaryMetrics(this.activeFilterCity, this.activeFilterDate).subscribe(metrics => {
      this.metrics = metrics;
    });

    this.adminDataService.getOriginBreakdown(this.activeFilterCity, this.activeFilterDate).subscribe(data => {
      this.originBreakdown = data;
      this.updateGrowthChart();
    });

    this.adminDataService.getCategoryBreakdown(this.activeFilterCity, this.activeFilterDate).subscribe(data => {
      this.categoryBreakdown = data;
      this.updateDestinationChart();
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 400);
  }

  private initGrowthChart(): void {
    if (!this.growthChartRef) {
      return;
    }

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: this.originBreakdown.labels,
        datasets: [
          {
            label: 'Active Travelers',
            data: this.originBreakdown.values,
            borderColor: '#B34724',
            backgroundColor: 'rgba(179, 71, 36, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          // Note: '#EADEC9/20' isn't a valid CSS color — that was a Tailwind opacity
          // suffix left over from the original markup. Using an 8-digit hex (20% alpha) instead.
          y: { grid: { color: '#EADEC933' } },
          x: { grid: { display: false } }
        }
      }
    };

    this.growthChart = new Chart(this.growthChartRef.nativeElement, config);
  }

  private initDestinationChart(): void {
    if (!this.destinationChartRef) {
      return;
    }

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: this.categoryBreakdown.labels,
        datasets: [
          {
            data: this.categoryBreakdown.values,
            backgroundColor: ['#B34724', '#2C5234', '#D4AF37', '#6E655F']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    };

    this.destinationChart = new Chart(this.destinationChartRef.nativeElement, config);
  }

  private updateGrowthChart(): void {
    if (!this.growthChart) {
      this.initGrowthChart();
      return;
    }

    this.growthChart.data.labels = this.originBreakdown.labels;
    this.growthChart.data.datasets[0].data = this.originBreakdown.values;
    this.growthChart.update();
  }

  private updateDestinationChart(): void {
    if (!this.destinationChart) {
      this.initDestinationChart();
      return;
    }

    this.destinationChart.data.labels = this.categoryBreakdown.labels;
    this.destinationChart.data.datasets[0].data = this.categoryBreakdown.values;
    this.destinationChart.update();
  }
}
