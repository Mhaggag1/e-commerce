import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { CustomtranslationService } from './customtranslation.service';

describe('CustomtranslationService', () => {
  beforeEach(() => {
    localStorage.removeItem('lang');
    TestBed.configureTestingModule({
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })],
    });
  });

  afterEach(() => {
    localStorage.removeItem('lang');
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  });

  it('restores Arabic and its document direction', () => {
    localStorage.setItem('lang', 'ar');
    const service = TestBed.inject(CustomtranslationService);
    service.initialize();
    expect(service.currentLanguage()).toBe('ar');
    expect(TestBed.inject(TranslateService).getCurrentLang()).toBe('ar');
    expect(TestBed.inject(DOCUMENT).documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
  });

  it('switches back to English and persists the selection', () => {
    const service = TestBed.inject(CustomtranslationService);
    service.changeLanguage('ar');
    service.changeLanguage('en');
    expect(localStorage.getItem('lang')).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(TestBed.inject(TranslateService).getCurrentLang()).toBe('en');
  });

  it('falls back to English for an unsupported saved language', () => {
    localStorage.setItem('lang', 'fr');
    const service = TestBed.inject(CustomtranslationService);
    service.initialize();
    expect(service.currentLanguage()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('uses English on the server without reading browser preferences', () => {
    localStorage.setItem('lang', 'ar');
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    const service = TestBed.inject(CustomtranslationService);
    service.initialize();
    expect(service.currentLanguage()).toBe('en');
    expect(localStorage.getItem('lang')).toBe('ar');
  });
});
