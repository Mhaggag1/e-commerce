import { isPlatformBrowser } from '@angular/common';
import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxMatToastService } from 'ngx-mat-toast';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export const BACKGROUND_REQUEST = new HttpContextToken(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    !isPlatformBrowser(inject(PLATFORM_ID)) ||
    req.context.get(BACKGROUND_REQUEST) ||
    !req.url.startsWith(environment.baseUrl + '/api/')
  )
    return next(req);

  const toast = inject(NgxMatToastService);
  const translate = inject(TranslateService);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (
          !(event instanceof HttpResponse) ||
          !['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
        )
          return;
        const body = event.body as { message?: string } | null;
        const message = body?.message;
        toast.success(
          typeof message === 'string' && message.trim() && message.toLowerCase() !== 'success'
            ? message
            : translate.instant('UI.ACTION_SUCCESS'),
        );
      },
      error: (err: HttpErrorResponse) => {
        const details = err.error;
        const validation = Array.isArray(details?.errors)
          ? details.errors[0]?.msg
          : details?.errors?.msg;
        const message = validation || details?.message;
        const fallback = err.status === 0 ? 'UI.NETWORK_ERROR' : 'UI.REQUEST_ERROR';
        toast.error(
          typeof message === 'string' && message.trim() ? message : translate.instant(fallback),
        );
      },
    }),
  );
};
