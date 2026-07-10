import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class login {
  showAllServices = signal(false);

  toggleServices(): void {
    this.showAllServices.update((v) => !v);
  }
}