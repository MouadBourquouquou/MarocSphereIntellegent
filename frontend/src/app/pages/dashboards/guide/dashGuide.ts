import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dash-guide',
  standalone: true,
  imports: [],
  templateUrl: './dashGuide.html',
  styleUrls: ['./dashGuide.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class dashGuide implements AfterViewInit, OnDestroy {
  showAllServices = signal(false);

  private isBrowser: boolean;
  private cleanupFns: Array<() => void> = [];
  private chart: Chart | null = null;
  private chartTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ==========================
  // Toggle Services
  // ==========================
  toggleServices(): void {
    this.showAllServices.update((value) => !value);
  }

  // ==========================
  // Toggle Any Element
  // ==========================
  toggleElement(selector: string): void {
    if (!this.isBrowser) return;

    const element = document.querySelector<HTMLElement>(selector);

    if (element) {
      element.style.display =
        element.style.display === 'none' ? '' : 'none';
    }
  }

  // ==========================
  // Lifecycle
  // ==========================
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.setupSmoothScroll();
    this.setupFormPreventDefault();
    this.initAdminMetricsChart();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];

    if (this.chartTimeoutId !== null) {
      clearTimeout(this.chartTimeoutId);
    }

    this.chart?.destroy();
  }

  // ==========================
  // Smooth Scroll
  // ==========================
  private setupSmoothScroll(): void {
    const anchors =
      this.elRef.nativeElement.querySelectorAll<HTMLAnchorElement>(
        'a[href^="#"]'
      );

    anchors.forEach((anchor) => {
      const onClick = (event: Event): void => {
        const href = anchor.getAttribute('href');

        if (!href) return;

        const target =
          this.elRef.nativeElement.querySelector<HTMLElement>(href);

        if (target) {
          event.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      };

      anchor.addEventListener('click', onClick);
      this.cleanupFns.push(() =>
        anchor.removeEventListener('click', onClick)
      );
    });
  }

  // ==========================
  // Prevent Form Submit
  // ==========================
  private setupFormPreventDefault(): void {
    const forms =
      this.elRef.nativeElement.querySelectorAll<HTMLFormElement>('form');

    forms.forEach((form) => {
      const onSubmit = (event: Event): void => {
        event.preventDefault();
      };

      form.addEventListener('submit', onSubmit);

      this.cleanupFns.push(() =>
        form.removeEventListener('submit', onSubmit)
      );
    });
  }

  // ==========================
  // Chart.js
  // ==========================
  private initAdminMetricsChart(): void {
    this.chartTimeoutId = setTimeout(() => {
      const canvas =
        this.elRef.nativeElement.querySelector<HTMLCanvasElement>(
          '#adminMetricsChart'
        );

      if (!canvas) return;

      Chart.register(...registerables);

      this.chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [
            {
              label: 'Secure Escrow Volume',
              data: [
                800000,
                1100000,
                1300000,
                1500000,
                1700000,
                1800000,
              ],
              borderColor: '#B63739',
              backgroundColor: 'rgba(182,55,57,0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Released Payouts',
              data: [
                600000,
                850000,
                1000000,
                1200000,
                1350000,
                1500000,
              ],
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
                font: {
                  size: 11,
                  family: 'Plus Jakarta Sans',
                },
                color: '#665E54',
              },
            },
          },
          scales: {
            y: {
              grid: {
                color: '#EFEAE2',
              },
              ticks: {
                color: '#665E54',
                font: {
                  size: 10,
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#665E54',
                font: {
                  size: 10,
                },
              },
            },
          },
        },
      });
    }, 50);
  }
}