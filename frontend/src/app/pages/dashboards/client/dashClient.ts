import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard-client',
  imports: [],
  templateUrl: './dashClient.html',
  styleUrls: ['./dashClient.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardClient {
  showAllServices = signal(false);

  toggleServices(): void {
    this.showAllServices.update((v) => !v);
  }
}