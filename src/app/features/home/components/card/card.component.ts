import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, input, InputSignal, signal } from '@angular/core';
import { Product } from '../../../../core/models/iproduct/product.interface';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart/cart.service';
import { WishlistService } from '../../../../core/services/wishlist/wishlist.service';

@Component({
  imports: [TranslatePipe, RouterLink],
  selector: 'app-card',
  styleUrl: './card.component.css',
  templateUrl: './card.component.html',
})
export class CardComponent {
  product: InputSignal<Product> = input.required<Product>();
  readonly stars = [1, 2, 3, 4, 5];
  readonly savedProductId = signal('');
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  addProductToWishlist(productId: string): void {
    this.wishlistService.addProductToWishlist(productId).subscribe({
      next: () => {
        this.savedProductId.set(productId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addProductToCart(productId: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
