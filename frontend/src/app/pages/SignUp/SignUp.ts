import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  imports: [],
  templateUrl: './SignUp.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignUp {
  showAllServices = signal(false);

  toggleServices(): void {
    this.showAllServices.update((v) => !v);
  }
}