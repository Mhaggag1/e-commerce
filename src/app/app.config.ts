import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideNgxMatToast } from 'ngx-mat-toast';
import { errorInterceptor } from './core/interceptors/error/error.interceptor';

import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { loadingInterceptor } from './core/interceptors/loading/loading.interceptor';
import { headerInterceptor } from './core/interceptors/loading/header/header.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      withViewTransitions(),
    ),
    provideClientHydration(),
    importProvidersFrom(NgxSpinnerModule),

    provideNgxMatToast({ preventDuplicates: true, maxToasts: 3, duration: 4000 }),
    provideHttpClient(
      withFetch(),
      withInterceptors([loadingInterceptor, headerInterceptor, errorInterceptor]),
    ),
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
