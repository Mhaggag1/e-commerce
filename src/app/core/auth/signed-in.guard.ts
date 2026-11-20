import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
export const signedInGuard: CanActivateFn = () =>
  !!localStorage.getItem('token') || inject(Router).createUrlTree(['/login']);
