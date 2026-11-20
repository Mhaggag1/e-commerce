import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { NgxMatToastService } from 'ngx-mat-toast';
import { FlowbiteService } from '../../core/services/custom-flowbit/custom-flowbite.service';
import { errorInterceptor } from '../../core/interceptors/error/error.interceptor';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let http: HttpTestingController;
  const toast = { success: vi.fn(), error: vi.fn() };

  beforeEach(async () => {
    localStorage.removeItem('token');
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: NgxMatToastService, useValue: toast },
        { provide: FlowbiteService, useValue: { loadFlowbite: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    http = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.removeItem('token');
    http.verify();
  });

  it('loads both badges at login, uses action responses, and hides them on logout', async () => {
    localStorage.setItem('token', 'test-token');
    component.checkLogin();
    await fixture.whenStable();
    http
      .expectOne((req) => req.url.endsWith('/v2/cart'))
      .flush({ data: { products: [{ count: 4 }] } });
    http.expectOne((req) => req.url.endsWith('/v1/wishlist')).flush({ count: 0, data: [] });
    await fixture.whenStable();
    expect(component.cartCount()).toBe(1);
    expect(component.wishlistCount()).toBe(0);
    expect(toast.success).not.toHaveBeenCalled();

    TestBed.inject(WishlistService).addProductToWishlist('product').subscribe();
    http
      .expectOne((req) => req.method === 'POST')
      .flush({ message: 'Product saved', data: ['product'] });
    TestBed.inject(CartService).addProductToCart('product').subscribe();
    http.expectOne((req) => req.method === 'POST').flush({ numOfCartItems: 2 });
    http.expectNone((req) => req.method === 'GET');
    await fixture.whenStable();
    expect(toast.success).toHaveBeenCalledWith('Product saved');
    expect(
      fixture.nativeElement.querySelector('a[href="/cart"] .item-count').textContent.trim(),
    ).toBe('2');
    expect(
      fixture.nativeElement.querySelector('a[href="/wishlist"] .item-count').textContent.trim(),
    ).toBe('1');
    component.signOut();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.item-count')).toBeNull();
  });

  it('shows the API error and lets the component handle the failed request', () => {
    const onError = vi.fn();
    TestBed.inject(CartService).addProductToCart('product').subscribe({ error: onError });
    http
      .expectOne((req) => req.method === 'POST')
      .flush({ message: 'Out of stock' }, { status: 400, statusText: 'Bad Request' });
    expect(toast.error).toHaveBeenCalledWith('Out of stock');
    expect(onError).toHaveBeenCalledOnce();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
