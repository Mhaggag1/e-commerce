import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { CartComponent } from './cart.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates the heading and empty cart count when switching to Arabic', async () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      UI: { SHOPPING_CART: 'Shopping Cart', CART_ITEM_COUNT: 'Items in your cart: {{count}}' },
    });
    translate.setTranslation('ar', {
      UI: { SHOPPING_CART: 'سلة التسوق', CART_ITEM_COUNT: 'عدد المنتجات في سلتك: {{count}}' },
    });

    translate.use('en');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Shopping Cart');

    translate.use('ar');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('سلة التسوق');
    expect(fixture.nativeElement.textContent).toContain('عدد المنتجات في سلتك: 0');
  });
});
