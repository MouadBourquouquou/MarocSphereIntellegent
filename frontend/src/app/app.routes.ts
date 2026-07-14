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

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/Login/login').then((m) => m.login),
  },

  {
    path: 'dashboard-client',
    loadComponent: () =>
      import('./pages/dashboards/client/home/dashClient').then((m) => m.DashboardClient),
  },

  {
    path: 'marketplace',
    loadComponent: () =>
      import('./pages/dashboards/client/Artisan & Guides Marketplace/marketplace').then((m) => m.marketplace),
  },


  {
    path: 'client-profile',
    loadComponent: () =>
      import('./pages/profiles/client/profileClient').then((m) => m.profileClient),
  },
  {
    path: 'dashboard-artisan',
    loadComponent: () =>
      import('./pages/dashboards/artisan/dashArtisan').then((m) => m.dashboardArtisan),
  },

  {
    path: 'dashboard-guide',
    loadComponent: () =>
      import('./pages/dashboards/guide/dashGuide').then((m) => m.dashGuide),
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin').then((m) => m.admin),
  },


];