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
      import('./pages/dashboards/client/dashClient').then((m) => m.DashboardClient),
  },

];