import { AuthService } from '../../core/auth/services/auth.service';
import { OrderService } from '../../core/services/order/order.service';
import { switchMap } from 'rxjs';
import { Component, inject, signal } from '@angular/core';
@Component({
  imports: [],
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  readonly orders = signal<
    {
      _id: string;
      id: number;
      totalOrderPrice: number;
      paymentMethodType: string;
      isDelivered: boolean;
      cartItems: { _id: string; count: number; product: { title: string } | null }[];
    }[]
  >([]);
  readonly message = signal('Loading orders…');
  ngOnInit(): void {
    this.authService
      .verifyToken()
      .pipe(switchMap((res) => this.orderService.getUserOrders(res.decoded.id)))
      .subscribe({
        next: (res) => {
          this.orders.set(res);
          this.message.set(res.length ? '' : 'You have no orders yet.');
        },
        error: () => this.message.set('Could not load your orders.'),
      });
  }
}
