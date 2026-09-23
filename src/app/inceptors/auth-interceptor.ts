import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { timer } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ServerStatus } from '../services/server-status/server-status';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const serverStatus = inject(ServerStatus);

  const token = localStorage.getItem('token');

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  let timerId: ReturnType<typeof setTimeout> | null = null;

  timerId = setTimeout(() => {
    serverStatus.showWakingUp();
  }, 5000);

  return next(authReq).pipe(
    finalize(() => {
      if (timerId !== null) {
        clearTimeout(timerId);
      }

      serverStatus.hideWakingUp();
    })
  );
};