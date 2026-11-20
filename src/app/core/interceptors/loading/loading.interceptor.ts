import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { BACKGROUND_REQUEST } from '../error/error.interceptor';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(BACKGROUND_REQUEST)) return next(req);
  //Request
  let spinner = inject(NgxSpinnerService);

  spinner.show();
  return next(req).pipe(
    finalize(() => {
      spinner.hide();
    }),
  ); //Rx.js for response
};
