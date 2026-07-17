import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.currentUser()?.role?.toUpperCase().replace('ROLE_', '');

  if (role === 'ADMIN') return true;

  if (auth.isAuthenticated()) {
    // logged in but not admin → back to their dashboard
    return router.createUrlTree(['/dashboard-client']);
  }

  return router.createUrlTree(['/login']);
};
