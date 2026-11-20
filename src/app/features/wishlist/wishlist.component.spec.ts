import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { headerInterceptor } from '../../core/interceptors/loading/header/header.interceptor';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { WishlistComponent } from './wishlist.component';

describe('WishlistComponent', () => {
  const wishlistUrl = `${environment.baseUrl}/api/v1/wishlist`;
  let component: WishlistComponent;
  let fixture: ComponentFixture<WishlistComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.removeItem('token');
    await TestBed.configureTestingModule({
      imports: [WishlistComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideHttpClient(withInterceptors([headerInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WishlistComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.removeItem('token');
    http.verify();
  });

  it('asks guests to sign in without fetching a wishlist', async () => {
    await fixture.whenStable();

    expect(component.status()).toBe('signed-out');
    http.expectNone(wishlistUrl);
  });

  it('loads saved products and removes a product only after the API confirms', async () => {
    localStorage.setItem('token', 'test-token');
    await fixture.whenStable();

    const product = { _id: 'first', title: 'Shoes', category: { name: 'Clothing' } };
    const getRequest = http.expectOne({ method: 'GET', url: wishlistUrl });
    expect(getRequest.request.headers.get('token')).toBe('test-token');
    getRequest.flush({ status: 'success', count: 1, data: [product] });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('article').textContent).toContain('Shoes');

    (fixture.nativeElement.querySelector('article button') as HTMLButtonElement).click();
    const deleteRequest = http.expectOne({ method: 'DELETE', url: `${wishlistUrl}/first` });
    expect(component.wishlistData()).toHaveLength(1);
    deleteRequest.flush({ status: 'success', data: [] });
    expect(component.wishlistData()).toEqual([]);
  });

  it('sends the selected product ID when adding a product', () => {
    localStorage.setItem('token', 'test-token');
    TestBed.inject(WishlistService).addProductToWishlist('first').subscribe();

    const request = http.expectOne({ method: 'POST', url: wishlistUrl });
    expect(request.request.body).toEqual({ productId: 'first' });
    expect(request.request.headers.get('token')).toBe('test-token');
    request.flush({ status: 'success', data: ['first'] });
  });
});
