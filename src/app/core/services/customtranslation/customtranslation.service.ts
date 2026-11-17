import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Service, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Service()
export class CustomtranslationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);
  private readonly language = signal<'en' | 'ar'>('en');
  readonly currentLanguage = this.language.asReadonly();

  initialize(): void {
    let lang = 'en';
    if (isPlatformBrowser(this.platformId)) {
      try {
        lang = localStorage.getItem('lang') ?? 'en';
      } catch {
        // Translation still works when browser storage is unavailable.
      }
    }
    this.changeLanguage(lang);
  }

  changeDirection(): void {
    this.document.documentElement.dir = this.language() === 'ar' ? 'rtl' : 'ltr';
    this.document.documentElement.lang = this.language();
  }

  changeLanguage(lang: string): void {
    const supportedLanguage = lang === 'ar' ? 'ar' : 'en';
    this.language.set(supportedLanguage);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('lang', supportedLanguage);
      } catch {
        // Keep switching languages even if persistence is blocked.
      }
    }
    this.translate.use(supportedLanguage);
    this.changeDirection();
  }
}
