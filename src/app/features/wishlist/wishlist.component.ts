import {
  afterNextRender,
  Component,
  inject,
  Injector,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Product } from '../../core/models/iproduct/product.interface';

@Component({
  imports: [RouterLink, TranslatePipe],
  selector: 'app-wishlist',
  styleUrl: './wishlist.component.css',
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly injector = inject(Injector);

  wishlistData: WritableSignal<Product[]> = signal([]);
  readonly status = signal<'loading' | 'ready' | 'signed-out' | 'error'>('loading');
  readonly removingProductId = signal('');
  readonly removeError = signal(false);
  readonly addingProductId = signal('');
  readonly cartMessage = signal('');

  ngOnInit(): void {
    afterNextRender(() => this.getLoggedUserWishlist(), { injector: this.injector });
  }

  getLoggedUserWishlist(): void {
    if (!localStorage.getItem('token')) {
      this.status.set('signed-out');
      return;
    }

    this.status.set('loading');
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistData.set(res.data);
        this.status.set('ready');
      },
      error: (err) => {
        this.status.set(err.status === 401 ? 'signed-out' : 'error');
      },
    });
  }

  addProductToCart(productId: string): void {
    if (this.addingProductId()) return;

    this.addingProductId.set(productId);
    this.cartMessage.set('');
    this.cartService.addProductToCart(productId).subscribe({
      next: () => {
        this.cartMessage.set('UI.ITEM_ADDED_TO_CART');
        this.addingProductId.set('');
      },
      error: () => {
        this.cartMessage.set('UI.ADD_TO_CART_ERROR');
        this.addingProductId.set('');
      },
    });
  }

  removeItem(productId: string): void {
    if (this.removingProductId()) return;

    this.removingProductId.set(productId);
    this.removeError.set(false);
    this.wishlistService.removeProduct(productId).subscribe({
      next: () => {
        this.wishlistData.update((products) =>
          products.filter((product) => product._id !== productId),
        );
        this.removingProductId.set('');
      },
      error: () => {
        this.removeError.set(true);
        this.removingProductId.set('');
      },
    });
  }
}
