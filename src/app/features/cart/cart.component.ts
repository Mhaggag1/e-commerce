import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart/cart.service';
import { Icart } from '../../core/models/icart.interface';

@Component({
  imports: [RouterLink, TranslatePipe],
  selector: 'app-cart',
  styleUrl: './cart.component.css',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);

  cartData: WritableSignal<Icart | null> = signal(null);

  ngOnInit(): void {
    this.getLoggedUserCart();
  }

  getLoggedUserCart(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartData.set(res.data);
        console.log(this.cartData());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeProduct(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.cartData.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateCartQuant(productId: string, count: number): void {
    this.cartService.updateCartQuant(productId, count).subscribe({
      next: (res) => {
        console.log(res);
        this.cartData.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  readonly couponMessage = signal('');
  readonly applyingCoupon = signal(false);

  applyCoupon(code: string): void {
    if (!code.trim() || this.applyingCoupon()) return;
    this.applyingCoupon.set(true);
    this.couponMessage.set('');
    this.cartService.applyCoupon(code.trim()).subscribe({
      next: (res) => {
        this.cartData.set(res.data);
        this.couponMessage.set('UI.COUPON_APPLIED');
        this.applyingCoupon.set(false);
      },
      error: () => {
        this.couponMessage.set('UI.COUPON_ERROR');
        this.applyingCoupon.set(false);
      },
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartData.set(null);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
