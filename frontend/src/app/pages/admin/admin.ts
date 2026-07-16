import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  AfterViewInit,
} from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class admin implements AfterViewInit {
  showAllServices = signal(false);

  toggleServices(): void {
    this.showAllServices.update((v) => !v);
  }

  ngAfterViewInit(): void {
    // Mirrors the original setTimeout(..., 100) delay used to ensure
    // the canvas elements exist in the DOM before Chart.js attaches.
    setTimeout(() => {
      this.initMonthlyVolumeChart();
      this.initBookingDistributionChart();
    }, 100);
  }

  private initMonthlyVolumeChart(): void {
    const monthlyCtx = document.getElementById(
      'monthlyVolumeChart',
    ) as HTMLCanvasElement | null;
    if (!monthlyCtx) return;

    new Chart(monthlyCtx, {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'Escrow Holdings',
            data: [120000, 150000, 210000, 180000, 240000, 284500],
            borderColor: '#9D3E26',
            backgroundColor: 'rgba(157, 62, 38, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Released Funds',
            data: [340000, 420000, 510000, 680000, 790000, 842900],
            borderColor: '#1661A1',
            backgroundColor: 'rgba(22, 97, 161, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { grid: { color: '#E3DFD5' }, ticks: { color: '#5A5C5E' } },
          x: { grid: { display: false }, ticks: { color: '#5A5C5E' } },
        },
      },
    });
  }

  private initBookingDistributionChart(): void {
    const bookingCtx = document.getElementById(
      'bookingDistributionChart',
    ) as HTMLCanvasElement | null;
    if (!bookingCtx) return;

    new Chart(bookingCtx, {
      type: 'doughnut',
      data: {
        labels: ['Artisan Crafts', 'Local Guides', 'DMC Packages', 'Transport'],
        datasets: [
          {
            data: [45, 25, 20, 10],
            backgroundColor: ['#9D3E26', '#1661A1', '#E3DFD5', '#5A5C5E'],
            borderWidth: 2,
            borderColor: '#FFFFFF',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#2D2E30', font: { family: 'Inter' } },
          },
        },
      },
    });
  }
}