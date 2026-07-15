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


  {
    path: 'client-profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profiles/client/profileClient').then((m) => m.profileClient),
  },

  {
    path: 'artisan-profile/:id',
    loadComponent: () =>
      import('./pages/profiles/artisan/profileArtisan').then((m) => m.profileArtisan),
  },

  {
    path: 'guide-profile/:id',
    loadComponent: () =>
      import('./pages/profiles/guide/profileGuide').then((m) => m.profileGuide),
  },
  {
    path: 'dashboard-artisan',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboards/artisan/dashArtisan').then((m) => m.dashboardArtisan),
  },

  {
    path: 'dashboard-guide',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboards/guide/dashGuide').then((m) => m.dashGuide),
  },


];