import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { OrderService } from '../../core/services/order/order.service';
import { AddressService } from '../../core/services/address/address.service';
import { SavedAddress } from '../../core/models/shipping-address.interface';
import { PaymentComponent } from '../payment/payment.component';
import { Icart } from '../../core/models/icart.interface';
import { Component, inject, signal } from '@angular/core';
@Component({
  imports: [ReactiveFormsModule, RouterLink, PaymentComponent, TranslatePipe],
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css',
})
export class CheckOutComponent {
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly addressService = inject(AddressService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly addresses = signal<SavedAddress[]>([]);
  readonly loadingAddress = signal(false);
  readonly cartId = signal('');
  readonly cart = signal<Icart | null>(null);
  readonly cartState = signal<'loading' | 'ready' | 'empty' | 'error'>('loading');
  readonly method = signal<'cash' | 'card'>('cash');
  readonly message = signal('');
  readonly submitting = signal(false);
  readonly form = this.fb.nonNullable.group({
    details: ['', Validators.required],
    city: ['', Validators.required],
    phone: ['', Validators.required],
    postalCode: [''],
  });

  ngOnInit(): void {
    this.loadCart();
    this.addressService.getAddresses().subscribe({
      next: (res) => this.addresses.set(res.data),
      error: () => this.addresses.set([]),
    });
  }

  loadCart(): void {
    this.cartState.set('loading');
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cart.set(res.data);
        this.cartId.set(res.cartId || res.data?._id || '');
        this.cartState.set(
          !res.data?.products?.length ? 'empty' : this.cartId() ? 'ready' : 'error',
        );
      },
      error: (err) => this.cartState.set(err.status === 404 ? 'empty' : 'error'),
    });
  }

  useAddress(id: string): void {
    this.message.set('');
    if (!id) {
      this.form.reset();
      return;
    }
    this.loadingAddress.set(true);
    this.addressService.getAddress(id).subscribe({
      next: (res) => {
        const address: SavedAddress = res.data;
        this.form.patchValue({
          details: address.details,
          city: address.city,
          phone: address.phone,
          postalCode: address.postalCode ?? '',
        });
        this.loadingAddress.set(false);
      },
      error: () => {
        this.form.reset();
        this.loadingAddress.set(false);
        this.message.set('UI.ADDRESS_LOAD_FAILED');
      },
    });
  }

  placeOrder(): void {
    if (this.form.invalid || !this.cartId() || this.loadingAddress() || this.submitting()) return;
    this.submitting.set(true);
    this.message.set('');
    const address = this.form.getRawValue();
    const card = this.method() === 'card';
    const request = card
      ? this.orderService.checkoutSession(this.cartId(), address, window.location.origin)
      : this.orderService.createCashOrder(this.cartId(), address);
    request.subscribe({
      next: (res) => {
        if (!card) {
          this.router.navigate(['/orders']);
          return;
        }
        if (res.session?.url?.startsWith('https://')) window.location.assign(res.session.url);
        else {
          this.message.set('UI.PAYMENT_SESSION_FAILED');
          this.submitting.set(false);
        }
      },
      error: (err) => {
        this.message.set(err.error?.message || 'UI.CHECKOUT_FAILED');
        this.submitting.set(false);
      },
    });
  }
}
