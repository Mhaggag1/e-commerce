import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { ShippingAddress } from '../../models/shipping-address.interface';
@Service()
export class OrderService {
  private readonly httpClient = inject(HttpClient);
  private readonly cartService = inject(CartService);
  private readonly baseUrl = environment.baseUrl;
  getUserOrders(userId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/api/v1/orders/user/${userId}`);
  }

  createCashOrder(cartId: string, shippingAddress: ShippingAddress): Observable<any> {
    return this.httpClient
      .post<any>(`${this.baseUrl}/api/v2/orders/${cartId}`, {
        shippingAddress,
      })
      .pipe(tap(() => this.cartService.cartCount.set(0)));
  }

  checkoutSession(cartId: string, shippingAddress: ShippingAddress, url: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.baseUrl}/api/v1/orders/checkout-session/${cartId}`,
      { shippingAddress },
      { params: { url } },
    );
  }
}
