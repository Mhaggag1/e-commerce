import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Iwishlist } from '../../models/iwishlist.interface';

@Service()
export class WishlistService {
  private readonly httpClient = inject(HttpClient);

  addProductToWishlist(productId: string): Observable<unknown> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/wishlist`, {
      productId: productId,
    });
  }

  getLoggedUserWishlist(): Observable<Iwishlist> {
    return this.httpClient.get<Iwishlist>(`${environment.baseUrl}/api/v1/wishlist`);
  }

  removeProduct(productId: string): Observable<unknown> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${productId}`);
  }
}
