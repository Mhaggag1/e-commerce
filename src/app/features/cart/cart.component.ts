import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { Icart } from '../../core/models/icart.interface';

@Component({
  imports: [RouterLink],
  selector: 'app-cart',
  styleUrl: './cart.component.css',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);

  cartData: WritableSignal<Icart> = signal({} as Icart);

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

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartData.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
