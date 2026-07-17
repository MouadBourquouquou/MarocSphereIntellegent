import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { PlatformUser, ToastType, UserFormValue, UserRole, UserStatus } from '../admin/platform-user.model';

import 'iconify-icon';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-super-admin-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class admin implements AfterViewInit, OnDestroy {
  // Canvas refs — in the template, tag the two <canvas> elements with
  // #growthChart and #destinationChart instead of id="growthChart" / id="destinationChart".
  @ViewChild('growthChart') private growthChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('destinationChart') private destinationChartRef?: ElementRef<HTMLCanvasElement>;

  private growthChart?: Chart;
  private destinationChart?: Chart;
  private toastTimeoutId?: ReturnType<typeof setTimeout>;

  activeTab = 'users';

  users: PlatformUser[] = [
    { id: 101, name: 'Youssef El Alami', role: 'Guide', email: 'youssef.guide@marocsphere.com', date: '2025-01-12', status: 'Certified', rating: 4.9, country: 'Morocco', language: 'Arabic, French, English', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 102, name: 'Amina Benjelloun', role: 'Artisan', email: 'amina.crafts@marocsphere.com', date: '2025-02-05', status: 'Active', rating: 4.8, country: 'Morocco', language: 'Arabic, French', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 103, name: 'Sarah Miller', role: 'Client', email: 'sarah.m@yahoo.com', date: '2025-02-18', status: 'Active', rating: 5.0, country: 'USA', language: 'English', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: 104, name: 'Atlas Voyages', role: 'DMC', email: 'operations@atlasvoyages.ma', date: '2024-11-20', status: 'Active', rating: 4.7, country: 'Morocco', language: 'Arabic, French, Spanish', avatar: 'https://randomuser.me/api/portraits/men/78.jpg' },
    { id: 105, name: 'Karim Mansouri', role: 'Administrator', email: 'karim.m@marocsphere.com', date: '2024-09-01', status: 'Active', rating: 5.0, country: 'Morocco', language: 'Arabic, French, English', avatar: 'https://randomuser.me/api/portraits/men/54.jpg' }
  ];

  // Toast state — bind these in the template instead of calling getElementById.
  toastMessage = '';
  toastType: ToastType = 'success';
  toastVisible = false;

  showUserModal = false;
  modalMode: 'add' | 'edit' = 'add';
  currentUser: PlatformUser | null = null;

  searchQuery = '';
  filterRole: UserRole | 'All' = 'All';

  formName = '';
  formEmail = '';
  formRole: UserRole = 'Client';
  formStatus: UserStatus = 'Active';
  formLanguage = '';

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

  get modalTitle(): string {
    return this.modalMode === 'edit' ? 'Edit Platform User' : 'Add New Platform User';
  }

  trackUser(index: number, user: PlatformUser): number {
    return user.id;
  }

  ngAfterViewInit(): void {
    this.initGrowthChart();
    this.initDestinationChart();

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

    this.formName = this.currentUser?.name ?? '';
    this.formEmail = this.currentUser?.email ?? '';
    this.formRole = this.currentUser?.role ?? 'Client';
    this.formStatus = this.currentUser?.status ?? 'Active';
    this.formLanguage = this.currentUser?.language ?? '';
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.currentUser = null;
    this.resetForm();
  }

  submitUserForm(): void {
    const formValue: UserFormValue = {
      name: this.formName.trim(),
      email: this.formEmail.trim(),
      role: this.formRole,
      status: this.formStatus,
      language: this.formLanguage.trim()
    };

    this.saveUser(formValue);
  }

  private resetForm(): void {
    this.formName = '';
    this.formEmail = '';
    this.formRole = 'Client';
    this.formStatus = 'Active';
    this.formLanguage = '';
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

  private initGrowthChart(): void {
    if (!this.growthChartRef) {
      return;
    }

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Active Travelers',
            data: [4200, 5800, 8100, 10200, 12800, 14280],
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
        labels: ['Marrakech', 'Fes', 'Chefchaouen', 'Merzouga'],
        datasets: [
          {
            data: [45, 25, 18, 12],
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
}
