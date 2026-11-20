import { TranslatePipe } from '@ngx-translate/core';
import { model } from '@angular/core';
import { Component } from '@angular/core';
@Component({
  imports: [TranslatePipe],
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {
  readonly method = model<'cash' | 'card'>('cash');
}
