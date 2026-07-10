import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landingpage.html',
  styleUrls: ['./swipers.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingPage {
  showAllServices = signal(false);

  toggleServices(): void {
    this.showAllServices.update((v) => !v);
  }
}