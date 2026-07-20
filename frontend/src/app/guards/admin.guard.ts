import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.currentUser()?.role?.toUpperCase().replace('ROLE_', '');

  if (role === 'ADMIN') return true;

  if (auth.isAuthenticated()) {
    return router.createUrlTree(['/adminData']);
  }

  return router.createUrlTree(['/login']);
};

export const adminDataGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.currentUser()?.role?.toUpperCase().replace('ROLE_', '');

  if (role === 'ADMIN_DATA') return true;

  if (auth.isAuthenticated()) {
    return router.createUrlTree(['/admin']);
  }

  return router.createUrlTree(['/login']);
};
