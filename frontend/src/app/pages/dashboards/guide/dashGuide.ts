import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  computed,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Inject,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { GuideService } from '../../../services/guide.service';
import { Guide } from '../../../models/api.models';
import { AuthService } from '../../../services/auth.service';

interface ReservationRequest {
  id: string;
  name: string;
  avatar: string;
  date: string;
  duration: string;
  price: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
}

interface CalendarDay {
  date: Date;
  iso: string;
  label: string;
  day: number;
  weekday: number;
  status: 'past' | 'today' | 'available' | 'booked' | 'blocked' | 'selected';
  reservations: ReservationRequest[];
}

@Component({
  selector: 'app-dash-guide',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashGuide.html',
  styleUrls: ['./dashGuide.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class dashGuide implements AfterViewInit, OnDestroy {
  private guideService = inject(GuideService);
  private authService = inject(AuthService);

  showAllServices = signal(false);
  guide = signal<Guide | null>(null);
  guideName = signal('Chargement...');
  guidePrenom = signal('');
  guideEmail = signal('');
  telephone = signal('');
  nationalite = signal('');
  languePreferee = signal('');
  numeroLicence = signal('');
  statutCertification = signal('PENDING');
  scoreCertification = signal(0);
  disponible = signal(true);
  isLoading = signal(true);
  isSaving = signal(false);
  isEditing = signal(false);

  notificationMessage = signal('');
  notificationType = signal<'success' | 'error'>('success');
  showNotification = signal(false);
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  currentMonthIndex = signal(0);
  calendarFilter = signal<'all' | 'available' | 'booked' | 'blocked' | 'upcoming' | 'completed'>('all');
  selectedDates = signal<string[]>([]);
  selectedDate = signal<string | null>(null);
  selectedNote = signal('');
  workingHours = signal<Record<string, string>>({});
  recurringAvailabilityEnabled = signal(false);
  dateNotes = signal<Record<string, string>>({});
  blockedDates = signal<string[]>(['2026-10-09']);
  availableDates = signal<string[]>(['2026-10-16', '2026-10-18']);
  calendarSynced = signal(false);

  reservationRequests = signal<ReservationRequest[]>([
    {
      id: '#RES-9482',
      name: 'Youssef Alami',
      avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
      date: 'Oct 20, 2026',
      duration: '3 Hours',
      price: '350 MAD/hr',
      status: 'pending',
    },
    {
      id: '#RES-9411',
      name: 'Sarah Jenkins',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: 'Oct 22, 2026',
      duration: 'Full Day',
      price: '350 MAD/hr',
      status: 'pending',
    },
  ]);

  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isBrowser: boolean;
  private cleanupFns: Array<() => void> = [];
  private today = new Date();
  private chart: Chart | null = null;
  private chartTimeoutId: ReturnType<typeof setTimeout> | null = null;

  months = computed(() => {
    const months: Date[] = [];
    const start = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    for (let i = 0; i < 10; i += 1) {
      months.push(new Date(start.getFullYear(), start.getMonth() + i, 1));
    }
    return months;
  });

  selectedMonth = computed(() => this.months()[this.currentMonthIndex()]);

  calendarReservations = computed(() => {
    const reservations = new Map<string, ReservationRequest[]>();
    this.reservationRequests().forEach((request) => {
      const iso = this.toIsoDate(request.date);
      if (!reservations.has(iso)) {
        reservations.set(iso, []);
      }
      reservations.get(iso)?.push(request);
    });
    return reservations;
  });

  bookedDateSet = computed(() => {
    const set = new Set<string>();
    this.reservationRequests().forEach((request) => {
      if (request.status === 'accepted' || request.status === 'completed') {
        set.add(this.toIsoDate(request.date));
      }
    });
    return set;
  });

  filteredReservations = computed(() => {
    const nowIso = this.toIsoDate(this.today);
    return this.reservationRequests().filter((request) => {
      if (this.calendarFilter() === 'all') return true;
      if (this.calendarFilter() === 'available') return request.status === 'pending';
      if (this.calendarFilter() === 'booked') return request.status === 'accepted';
      if (this.calendarFilter() === 'blocked') return request.status === 'cancelled';
      if (this.calendarFilter() === 'upcoming') return request.status === 'accepted' && this.toIsoDate(request.date) >= nowIso;
      if (this.calendarFilter() === 'completed') return request.status === 'completed';
      return true;
    });
  });

  monthCalendar = computed(() => {
    const monthStart = this.selectedMonth();
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalSlots = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

    return Array.from({ length: totalSlots }, (_, index) => {
      const dayNumber = index - firstDayOfWeek + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) {
        return null;
      }

      const date = new Date(year, month, dayNumber);
      const iso = this.toIsoDate(date);
      const reservations = this.calendarReservations().get(iso) ?? [];
      const status = this.calculateDayStatus(date, iso, reservations);

      return {
        date,
        iso,
        label: dayNumber.toString(),
        day: dayNumber,
        weekday: date.getDay(),
        status,
        reservations,
      } as CalendarDay;
    });
  });

  constructor(
    private elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  toggleServices(): void {
    this.showAllServices.update((v) => !v);
  }

  toggleElement(selector: string): void {
    if (!this.isBrowser) return;
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      element.style.display = element.style.display === 'none' ? '' : 'none';
    }
  }

  ngAfterViewInit(): void {
    this.loadGuide();
    if (!this.isBrowser) return;
    this.setupSmoothScroll();
    this.setupFormPreventDefault();
    this.initAdminMetricsChart();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    if (this.chartTimeoutId !== null) clearTimeout(this.chartTimeoutId);
    if (this.toastTimeoutId !== null) clearTimeout(this.toastTimeoutId);
    this.chart?.destroy();
  }

  private loadGuide(): void {
    this.guideService.getMe().subscribe({
      next: (guide) => {
        this.guide.set(guide);
        this.guideName.set(guide.nom ?? '');
        this.guidePrenom.set(guide.prenom ?? '');
        this.guideEmail.set(guide.email ?? '');
        this.telephone.set(guide.telephone ?? '');
        this.nationalite.set(guide.nationalite ?? '');
        this.languePreferee.set(guide.languePreferee ?? '');
        this.numeroLicence.set(guide.numeroLicence ?? '');
        this.statutCertification.set(guide.statutCertification ?? 'PENDING');
        this.scoreCertification.set(guide.scoreCertification ?? 0);
        this.disponible.set(guide.disponible ?? true);
        this.isLoading.set(false);
      },
      error: () => {
        this.showNotificationMessage('Erreur lors du chargement du profil.', 'error');
        this.isLoading.set(false);
      },
    });
  }

  toggleEditMode(isEdit: boolean): void {
    this.isEditing.set(isEdit);
    if (!isEdit) {
      const g = this.guide();
      if (g) {
        this.guideName.set(g.nom ?? '');
        this.guidePrenom.set(g.prenom ?? '');
        this.telephone.set(g.telephone ?? '');
        this.nationalite.set(g.nationalite ?? '');
        this.languePreferee.set(g.languePreferee ?? '');
        this.numeroLicence.set(g.numeroLicence ?? '');
      }
    }
  }

  saveDetails(event: Event): void {
    event.preventDefault();
    const g = this.guide();
    if (!g) return;

    this.isSaving.set(true);
    this.guideService.updateProfile(g.id!, {
      nom: this.guideName(),
      prenom: this.guidePrenom(),
      telephone: this.telephone(),
      nationalite: this.nationalite(),
      languePreferee: this.languePreferee(),
      numeroLicence: this.numeroLicence(),
    }).subscribe({
      next: (updated) => {
        this.guide.set(updated);
        this.guideName.set(updated.nom ?? '');
        this.guidePrenom.set(updated.prenom ?? '');
        this.telephone.set(updated.telephone ?? '');
        this.nationalite.set(updated.nationalite ?? '');
        this.languePreferee.set(updated.languePreferee ?? '');
        this.numeroLicence.set(updated.numeroLicence ?? '');
        this.isEditing.set(false);
        this.isSaving.set(false);
        this.showNotificationMessage('Profil mis a jour avec succes.', 'success');
      },
      error: () => {
        this.isSaving.set(false);
        this.showNotificationMessage('Erreur lors de la mise a jour du profil.', 'error');
      },
    });
  }

  toIsoDate(value: string | Date): string {
    const date = typeof value === 'string' ? new Date(value) : value;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatMonthLabel(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  calculateDayStatus(date: Date, iso: string, reservations: ReservationRequest[]): 'past' | 'today' | 'available' | 'booked' | 'blocked' | 'selected' {
    const todayIso = this.toIsoDate(this.today);
    const isToday = iso === todayIso;
    const isSelected = this.selectedDates().includes(iso);
    const isPast = iso < todayIso;

    if (isPast) return 'past';
    if (isSelected) return 'selected';
    if (this.blockedDates().includes(iso)) return 'blocked';
    if (this.bookedDateSet().has(iso)) return 'booked';
    if (isToday) return 'today';
    return 'available';
  }

  onMonthPrev(): void {
    this.currentMonthIndex.update((value) => Math.max(0, value - 1));
  }

  onMonthNext(): void {
    this.currentMonthIndex.update((value) => Math.min(this.months().length - 1, value + 1));
  }

  addAvailableDates(): void {
    const current = this.selectedMonth();
    const monthKey = this.toIsoDate(new Date(current.getFullYear(), current.getMonth(), 1));
    const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    const existing = this.availableDates().filter((iso) => iso.startsWith(monthKey.substring(0, 7)));
    const nextDayNumber = existing.length > 0 ? Number(existing[existing.length - 1].split('-')[2]) + 1 : 1;
    const nextDay = Math.min(nextDayNumber, lastDay);
    const nextIso = this.toIsoDate(new Date(current.getFullYear(), current.getMonth(), nextDay));
    this.availableDates.update((dates) => Array.from(new Set([...dates, nextIso])));
    this.showNotificationMessage('Added another available date for the current month.', 'success');
  }

  syncCalendar(): void {
    this.calendarSynced.update((value) => !value);
    const message = this.calendarSynced() ? 'Calendar synced successfully.' : 'Calendar sync paused.';
    this.showNotificationMessage(message, 'success');
  }

  toggleReservationStatus(id: string, status: ReservationRequest['status']): void {
    this.reservationRequests.update((requests) =>
      requests.map((request) => request.id === id ? { ...request, status } : request)
    );
  }

  acceptReservation(id: string): void {
    this.toggleReservationStatus(id, 'accepted');
    this.showNotificationMessage('Reservation accepted. The calendar has been updated.', 'success');
  }

  rejectReservation(id: string): void {
    this.toggleReservationStatus(id, 'rejected');
    this.showNotificationMessage('Reservation rejected. The date is available again.', 'success');
  }

  cancelReservation(id: string): void {
    this.toggleReservationStatus(id, 'cancelled');
    this.showNotificationMessage('Reservation cancelled and the date has been returned to availability.', 'success');
  }

  completeReservation(id: string): void {
    this.toggleReservationStatus(id, 'completed');
    this.showNotificationMessage('Reservation completed. Booking remains visible in history.', 'success');
  }

  toggleDateSelection(iso: string): void {
    if (this.toIsoDate(this.today) > iso) return;
    this.selectedDates.update((current) => {
      if (current.includes(iso)) return current.filter((item) => item !== iso);
      return [...current, iso];
    });
  }

  clearSelection(): void {
    this.selectedDates.set([]);
    this.selectedDate.set(null);
  }

  markSelectedAsBlocked(): void {
    const selection = this.selectedDates();
    if (!selection.length) {
      this.showNotificationMessage('Select dates first to block them.', 'error');
      return;
    }
    this.blockedDates.update((dates) => Array.from(new Set([...dates, ...selection])));
    this.selectedDates.set([]);
    this.showNotificationMessage('Selected dates are now blocked.', 'success');
  }

  markSelectedAsAvailable(): void {
    const selection = this.selectedDates();
    if (!selection.length) {
      this.showNotificationMessage('Select dates first to mark them available.', 'error');
      return;
    }
    this.blockedDates.update((dates) => dates.filter((iso) => !selection.includes(iso)));
    this.availableDates.update((dates) => Array.from(new Set([...dates, ...selection])));
    this.selectedDates.set([]);
    this.showNotificationMessage('Selected dates are now available.', 'success');
  }

  updateNoteForSelectedDate(): void {
    const iso = this.selectedDate();
    if (!iso) {
      this.showNotificationMessage('Pick a calendar date first.', 'error');
      return;
    }
    this.dateNotes.update((notes) => ({ ...notes, [iso]: this.selectedNote() }));
    this.showNotificationMessage('Note saved for the selected date.', 'success');
  }

  private showNotificationMessage(message: string, type: 'success' | 'error'): void {
    this.notificationMessage.set(message);
    this.notificationType.set(type);
    this.showNotification.set(true);
    if (this.toastTimeoutId !== null) clearTimeout(this.toastTimeoutId);
    this.toastTimeoutId = setTimeout(() => this.showNotification.set(false), 4000);
  }

  private setupSmoothScroll(): void {
    const anchors = this.elRef.nativeElement.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchors.forEach((anchor) => {
      const onClick = (event: Event): void => {
        const href = anchor.getAttribute('href');
        if (!href) return;
        const target = this.elRef.nativeElement.querySelector<HTMLElement>(href);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      anchor.addEventListener('click', onClick);
      this.cleanupFns.push(() => anchor.removeEventListener('click', onClick));
    });
  }

  private setupFormPreventDefault(): void {
    const forms = this.elRef.nativeElement.querySelectorAll<HTMLFormElement>('form');
    forms.forEach((form) => {
      const onSubmit = (event: Event): void => event.preventDefault();
      form.addEventListener('submit', onSubmit);
      this.cleanupFns.push(() => form.removeEventListener('submit', onSubmit));
    });
  }

  private initAdminMetricsChart(): void {
    this.chartTimeoutId = setTimeout(() => {
      const canvas = this.elRef.nativeElement.querySelector<HTMLCanvasElement>('#adminMetricsChart');
      if (!canvas) return;
      Chart.register(...registerables);
      this.chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [
            {
              label: 'Secure Escrow Volume',
              data: [800000, 1100000, 1300000, 1500000, 1700000, 1800000],
              borderColor: '#B63739',
              backgroundColor: 'rgba(182,55,57,0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Released Payouts',
              data: [600000, 850000, 1000000, 1200000, 1350000, 1500000],
              borderColor: '#006233',
              backgroundColor: 'rgba(0,98,51,0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { size: 11, family: 'Plus Jakarta Sans' },
                color: '#665E54',
              },
            },
          },
          scales: {
            y: {
              grid: { color: '#EFEAE2' },
              ticks: { color: '#665E54', font: { size: 10 } },
            },
            x: {
              grid: { display: false },
              ticks: { color: '#665E54', font: { size: 10 } },
            },
          },
        },
      });
    }, 50);
  }
}
