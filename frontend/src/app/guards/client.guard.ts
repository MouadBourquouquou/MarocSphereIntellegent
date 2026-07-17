import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const ROLE_ROUTES: Record<string, string> = {
  ADMIN:   '/admin',
  ARTISAN: '/dashboard-artisan',
  GUIDE:   '/dashboard-guide',
  DMC:     '/dashboard-dmc',
};

export const clientGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const role = (auth.currentUser()?.role ?? '').toUpperCase().replace('ROLE_', '');

  if (role === 'CLIENT' || role === '') {
    return true;
  }

  // Authenticated but wrong role — redirect to their own dashboard
  const redirect = ROLE_ROUTES[role] ?? '/landing';
  return router.createUrlTree([redirect]);
};
