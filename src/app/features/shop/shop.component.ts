import { TranslatePipe } from '@ngx-translate/core';
import { Component } from '@angular/core';

@Component({
  imports: [TranslatePipe],
  selector: 'app-shop',
  styleUrl: './shop.component.css',
  templateUrl: './shop.component.html',
})
export class ShopComponent {}
