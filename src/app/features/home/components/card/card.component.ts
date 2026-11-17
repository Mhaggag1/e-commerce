import { TranslatePipe } from '@ngx-translate/core';
import { Component, input, InputSignal } from '@angular/core';
import { Product } from '../../../../core/models/iproduct/product.interface';
import { RouterLink } from '@angular/router';

@Component({
  imports: [TranslatePipe, RouterLink],
  selector: 'app-card',
  styleUrl: './card.component.css',
  templateUrl: './card.component.html',
})
export class CardComponent {
  product: InputSignal<Product> = input.required<Product>();
  readonly stars = [1, 2, 3, 4, 5];
}
