import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-marketplace',
  imports: [],
  templateUrl: './marketplace.html',
  styleUrls: ['./marketplace.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class marketplace {
  showAllServices = signal(false);

  toggleServices(): void {
    this.showAllServices.update((v) => !v);
  }
}