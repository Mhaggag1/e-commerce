import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  //Request
  let spinner = inject(NgxSpinnerService);

  spinner.show();
  return next(req).pipe(
    finalize(() => {
      spinner.hide();
    }),
  ); //Rx.js for response
};
