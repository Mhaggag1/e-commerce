import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AddressService } from '../../core/services/address/address.service';
import { SavedAddress } from '../../core/models/shipping-address.interface';
import { Component, inject, signal } from '@angular/core';
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent {
  private readonly authService = inject(AuthService);
  private readonly addressService = inject(AddressService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly profile = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
  });
  readonly address = this.fb.nonNullable.group({
    name: ['', Validators.required],
    city: ['', Validators.required],
    details: ['', Validators.required],
    phone: ['', Validators.required],
  });
  readonly addresses = signal<SavedAddress[]>([]);
  readonly message = signal('');
  readonly busy = signal(false);

  ngOnInit(): void {
    try {
      this.profile.patchValue(JSON.parse(localStorage.getItem('user') || '{}'));
    } catch {
      this.profile.reset();
    }
    this.addressService.getAddresses().subscribe({
      next: (res) => this.addresses.set(res.data),
      error: () => this.message.set('Could not load your addresses.'),
    });
  }

  saveProfile(): void {
    if (this.profile.invalid || this.busy()) return;
    this.busy.set(true);
    const profile = this.profile.getRawValue();
    this.authService.updateUser(profile).subscribe({
      next: (res) => {
        localStorage.setItem('user', JSON.stringify(res.user || profile));
        this.busy.set(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.busy.set(false);
        this.message.set(err.error?.message || 'Could not update your profile.');
      },
    });
  }

  saveAddress(): void {
    if (this.address.invalid || this.busy()) return;
    this.busy.set(true);
    this.addressService.addAddress(this.address.getRawValue()).subscribe({
      next: (res) => {
        this.addresses.set(res.data);
        this.address.reset();
        this.busy.set(false);
        this.message.set('Address saved.');
      },
      error: (err) => {
        this.busy.set(false);
        this.message.set(err.error?.message || 'Could not save address.');
      },
    });
  }

  removeAddress(id: string): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.addressService.removeAddress(id).subscribe({
      next: () => {
        this.addresses.update((list) => list.filter((address) => address._id !== id));
        this.busy.set(false);
        this.message.set('Address removed.');
      },
      error: () => {
        this.busy.set(false);
        this.message.set('Could not remove address.');
      },
    });
  }
}
