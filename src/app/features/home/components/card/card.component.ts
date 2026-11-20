import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, input, InputSignal } from '@angular/core';
import { Product } from '../../../../core/models/iproduct/product.interface';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  imports: [TranslatePipe, RouterLink],
  selector: 'app-card',
  styleUrl: './card.component.css',
  templateUrl: './card.component.html',
})
export class CardComponent {
  product: InputSignal<Product> = input.required<Product>();
  readonly stars = [1, 2, 3, 4, 5];
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);

  addProductToCart(productId: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success(res.message, 'At Your Service Cart');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
