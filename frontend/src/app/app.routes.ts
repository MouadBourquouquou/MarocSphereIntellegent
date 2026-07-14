import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/Login/login').then((m) => m.login),
  },

  {
    path: 'dashboard-client',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboards/client/home/dashClient').then((m) => m.DashboardClient),
  },

  {
    path: 'marketplace',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboards/client/Artisan & Guides Marketplace/marketplace').then((m) => m.marketplace),
  },

];