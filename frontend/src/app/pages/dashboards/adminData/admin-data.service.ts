import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { PlatformUser } from './platform-user.model';

export interface DashboardMetrics {
  totalUsers: number;
  certifiedGuides: number;
  activeArtisans: number;
  completedTrips: number;
}

export interface ChartSeriesData {
  labels: string[];
  values: number[];
}

/**
 * Placeholder service for the admin dashboard data.
 * Each method returns an Observable<T> so the component can depend on a stable contract
 * while the backend team later swaps these mock implementations for real HTTP calls.
 */
@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly mockUsers: PlatformUser[] = [
    { id: 101, name: 'Youssef El Alami', role: 'Guide', email: 'youssef.guide@marocsphere.com', date: '2025-01-12', status: 'Certified', rating: 4.9, country: 'Morocco', language: 'Arabic, French, English', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 102, name: 'Amina Benjelloun', role: 'Artisan', email: 'amina.crafts@marocsphere.com', date: '2025-02-05', status: 'Active', rating: 4.8, country: 'Morocco', language: 'Arabic, French', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 103, name: 'Sarah Miller', role: 'Client', email: 'sarah.m@yahoo.com', date: '2025-02-18', status: 'Active', rating: 5.0, country: 'USA', language: 'English', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: 104, name: 'Atlas Voyages', role: 'DMC', email: 'operations@atlasvoyages.ma', date: '2024-11-20', status: 'Active', rating: 4.7, country: 'Morocco', language: 'Arabic, French, Spanish', avatar: 'https://randomuser.me/api/portraits/men/78.jpg' },
    { id: 105, name: 'Karim Mansouri', role: 'Administrator', email: 'karim.m@marocsphere.com', date: '2024-09-01', status: 'Active', rating: 5.0, country: 'Morocco', language: 'Arabic, French, English', avatar: 'https://randomuser.me/api/portraits/men/54.jpg' }
  ];

  private readonly dateFilterOptions = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Year to Date'];
  private readonly cityFilterOptions = ['All Regions', 'Marrakech-Safi', 'Fes-Meknes', 'Tangier-Tetouan'];

  getUsers(): Observable<PlatformUser[]> {
    return of(this.mockUsers).pipe(delay(300));
  }

  getDateFilterOptions(): Observable<string[]> {
    return of([...this.dateFilterOptions]).pipe(delay(300));
  }

  getCityFilterOptions(): Observable<string[]> {
    return of([...this.cityFilterOptions]).pipe(delay(300));
  }

  getSummaryMetrics(city: string, range: string): Observable<DashboardMetrics> {
    return of(this.buildMetrics(city, range)).pipe(delay(300));
  }

  getOriginBreakdown(city: string, range: string): Observable<ChartSeriesData> {
    return of(this.buildOriginBreakdown(city, range)).pipe(delay(300));
  }

  getCategoryBreakdown(city: string, range: string): Observable<ChartSeriesData> {
    return of(this.buildCategoryBreakdown(city, range)).pipe(delay(300));
  }

  private buildMetrics(city: string, range: string): DashboardMetrics {
    const cityMultiplier = city === 'All Regions' ? 1 : 0.78;
    const rangeMultiplier = this.getRangeMultiplier(range);

    return {
      totalUsers: Math.round(14280 * cityMultiplier * rangeMultiplier),
      certifiedGuides: Math.round(320 * cityMultiplier * rangeMultiplier),
      activeArtisans: Math.round(180 * cityMultiplier * rangeMultiplier),
      completedTrips: Math.round(12450 * cityMultiplier * rangeMultiplier)
    };
  }

  private buildOriginBreakdown(city: string, range: string): ChartSeriesData {
    const rangeMultiplier = this.getRangeMultiplier(range);
    const cityMultiplier = city === 'All Regions' ? 1 : 0.8;

    return {
      labels: ['France', 'Spain', 'Germany', 'Italy', 'United States'],
      values: [
        Math.round(12800 * rangeMultiplier * cityMultiplier),
        Math.round(9500 * rangeMultiplier * cityMultiplier),
        Math.round(7600 * rangeMultiplier * cityMultiplier),
        Math.round(6400 * rangeMultiplier * cityMultiplier),
        Math.round(5200 * rangeMultiplier * cityMultiplier)
      ]
    };
  }

  private buildCategoryBreakdown(city: string, range: string): ChartSeriesData {
    const rangeMultiplier = this.getRangeMultiplier(range);
    const cityMultiplier = city === 'All Regions' ? 1 : 0.85;

    return {
      labels: ['Cultural Tours', 'Food Experiences', 'Desert Trips', 'Coastal Escapes'],
      values: [
        Math.round(4200 * rangeMultiplier * cityMultiplier),
        Math.round(3100 * rangeMultiplier * cityMultiplier),
        Math.round(2500 * rangeMultiplier * cityMultiplier),
        Math.round(1800 * rangeMultiplier * cityMultiplier)
      ]
    };
  }

  private getRangeMultiplier(range: string): number {
    switch (range) {
      case 'Last 24 Hours':
        return 0.4;
      case 'Last 7 Days':
        return 0.7;
      case 'Last 30 Days':
        return 1;
      case 'Year to Date':
        return 1.35;
      default:
        return 1;
    }
  }
}
