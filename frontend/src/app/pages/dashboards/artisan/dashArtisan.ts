import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  computed,
  inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ArtisanService } from '../../../services/artisan.service';
import { AuthService } from '../../../services/auth.service';
import { Artisan } from '../../../models/api.models';
import { avatarUrl, fullName } from '../../../utils/display.utils';

@Component({
  selector: 'app-artisan-dashboard',
  imports: [RouterLink],
  templateUrl: './dashArtisan.html',
  styleUrls: ['./dashArtisan.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class dashboardArtisan implements OnInit, AfterViewInit, OnDestroy {
  private artisanService = inject(ArtisanService);
  private authService = inject(AuthService);

  isLoading = signal(true);
  errorMessage = signal('');
  artisan = signal<Artisan | null>(null);

  private isBrowser: boolean;
  private cleanupFns: Array<() => void> = [];
  private chart: Chart | null = null;
  private chartTimeoutId: ReturnType<typeof setTimeout> | null = null;

  displayName = computed(() => {
    const a = this.artisan();
    return a ? fullName(a.prenom, a.nom) : 'Artisan';
  });

  avatar = computed(() => avatarUrl(this.displayName()));

  memberSince = computed(() => {
    const a = this.artisan();
    if (!a?.dateCreation) return '—';
    const d = new Date(a.dateCreation);
    return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  });

  constructor(
    private elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.setupSmoothScroll();
    this.setupFormPreventDefault();
    this.initArtisanSalesChart();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    if (this.chartTimeoutId !== null) clearTimeout(this.chartTimeoutId);
    this.chart?.destroy();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.artisanService.getMe().subscribe({
      next: (profile) => {
        this.artisan.set(profile);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger votre profil artisan.');
        this.isLoading.set(false);
      },
    });
  }

  logout(): void {
    this.authService.logout();
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

  private initArtisanSalesChart(): void {
    this.chartTimeoutId = setTimeout(() => {
      const canvas = this.elRef.nativeElement.querySelector<HTMLCanvasElement>('#artisanSalesChart');
      if (!canvas) return;
      Chart.register(...registerables);
      this.chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [{
            label: 'Revenue (MAD)',
            data: [32000, 45000, 41000, 58000, 62000, 68400],
            borderColor: '#006233',
            backgroundColor: 'rgba(0, 98, 51, 0.05)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(234, 223, 201, 0.2)' } },
            x: { grid: { display: false } },
          },
        },
      });
    }, 100);
  }

  switchDashboardTab(tabId: string): void {
    if (!this.isBrowser) return;
    const root = this.elRef.nativeElement;
    root.querySelectorAll<HTMLElement>('.dash-tab-btn').forEach((btn) => {
      btn.classList.remove('bg-secondary', 'text-secondary-foreground', 'shadow-sm');
      btn.classList.add('text-muted-foreground', 'hover:text-foreground');
    });
    const activeBtn = root.querySelector<HTMLElement>(`#${tabId}-tab`);
    activeBtn?.classList.remove('text-muted-foreground', 'hover:text-foreground');
    activeBtn?.classList.add('bg-secondary', 'text-secondary-foreground', 'shadow-sm');
    root.querySelectorAll<HTMLElement>('.dash-tab-pane').forEach((pane) => pane.classList.add('hidden'));
    root.querySelector<HTMLElement>(`#${tabId}-content`)?.classList.remove('hidden');
  }
}
