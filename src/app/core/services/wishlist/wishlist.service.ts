import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Iwishlist } from '../../models/iwishlist.interface';

@Service()
export class WishlistService {
  private readonly httpClient = inject(HttpClient);
  readonly wishlistCount = signal<number | null>(null);

  addProductToWishlist(productId: string): Observable<unknown> {
    return this.httpClient
      .post<{ data: string[] }>(`${environment.baseUrl}/api/v1/wishlist`, {
        productId: productId,
      })
      .pipe(tap((res) => this.wishlistCount.set(res.data.length)));
  }

  getLoggedUserWishlist(context?: HttpContext): Observable<Iwishlist> {
    return this.httpClient.get<Iwishlist>(`${environment.baseUrl}/api/v1/wishlist`, { context });
  }

  removeProduct(productId: string): Observable<unknown> {
    return this.httpClient
      .delete<{ data: string[] }>(`${environment.baseUrl}/api/v1/wishlist/${productId}`)
      .pipe(tap((res) => this.wishlistCount.set(res.data.length)));
  }
}
