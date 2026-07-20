import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard, adminDataGuard } from './guards/admin.guard';
import { clientGuard } from './guards/client.guard';

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
    // canActivate: [clientGuard],
    loadComponent: () =>
      import('./pages/dashboards/client/home/dashClient').then((m) => m.DashboardClient),
  },

  {
    path: 'marketplace',
    // canActivate: [clientGuard],
    loadComponent: () =>
      import('./pages/dashboards/client/Artisan & Guides Marketplace/marketplace').then((m) => m.marketplace),
  },

  {
    path: 'client-profile',
    // canActivate: [clientGuard],
    loadComponent: () =>
      import('./pages/profiles/client/profileClient').then((m) => m.profileClient),
  },

  {
    path: 'artisan-profile/:id',
    // canActivate: [clientGuard],
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
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboards/artisan/dashArtisan').then((m) => m.dashboardArtisan),
  },

  {
    path: 'dashboard-guide',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboards/guide/dashGuide').then((m) => m.dashGuide),
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/dashboards/admin/admin').then((m) => m.admin),
  },

  {
    path: 'adminData',
    canActivate: [adminDataGuard],
    loadComponent: () =>
      import('./pages/dashboards/adminData/adminData').then((m) => m.adminData),
  },


];