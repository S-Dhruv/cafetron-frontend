import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const SKIP_AUTH_REDIRECT = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Apply cross-origin credential passing globally
  req = req.clone({
    withCredentials: true
  });

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 && authService.isLoggedIn() && !req.context.get(SKIP_AUTH_REDIRECT)) {
          authService.cleanLocalSession();
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};