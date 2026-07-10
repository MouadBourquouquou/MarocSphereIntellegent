import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./pages/landingPage/landingPage').then((m) => m.LandingPage),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./pages/SignUp/SignUp').then((m) => m.SignUp),
  },

];