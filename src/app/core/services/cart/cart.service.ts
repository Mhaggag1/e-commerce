import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Service()
export class CartService {
  private readonly httpClient = inject(HttpClient);
  readonly cartCount = signal<number | null>(null);

  private updateCount(res: { numOfCartItems?: number; data?: { products: unknown[] } }): void {
    this.cartCount.set(res.data?.products?.length ?? res.numOfCartItems ?? null);
  }

  addProductToCart(productId: string): Observable<any> {
    return this.httpClient
      .post(`${environment.baseUrl}/api/v2/cart`, {
        productId: productId,
      })
      .pipe(tap((res) => this.updateCount(res)));
  }

  getLoggedUserCart(context?: HttpContext): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v2/cart`, { context });
  }

  updateCartQuant(productId: string, count: number): Observable<any> {
    return this.httpClient
      .put(`${environment.baseUrl}/api/v2/cart/${productId}`, {
        count: count,
      })
      .pipe(tap((res) => this.updateCount(res)));
  }

  removeProduct(productId: string): Observable<any> {
    return this.httpClient
      .delete(`${environment.baseUrl}/api/v2/cart/${productId}`)
      .pipe(tap((res) => this.updateCount(res)));
  }

  applyCoupon(couponName: string): Observable<any> {
    return this.httpClient.put<any>(`${environment.baseUrl}/api/v2/cart/applyCoupon`, {
      couponName,
    });
  }

  clearCart(): Observable<any> {
    return this.httpClient
      .delete(`${environment.baseUrl}/api/v2/cart`)
      .pipe(tap(() => this.cartCount.set(0)));
  }
}
