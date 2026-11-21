import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AddressService } from '../../core/services/address/address.service';
import { SavedAddress } from '../../core/models/shipping-address.interface';
import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
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
  readonly accountName = signal('');
  readonly accountEmail = signal('');
  readonly addressState = signal<'loading' | 'ready' | 'error'>('loading');
  readonly profileMessage = signal('');
  readonly addressMessage = signal('');
  readonly removingId = signal('');
  readonly busy = signal(false);

  ngOnInit(): void {
    try {
      this.profile.patchValue(JSON.parse(localStorage.getItem('user') || '{}'));
      this.accountName.set(this.profile.controls.name.value || '');
      this.accountEmail.set(this.profile.controls.email.value || '');
    } catch {
      this.profile.reset();
    }
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.addressState.set('loading');
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        this.addresses.set(res.data);
        this.addressState.set('ready');
      },
      error: () => this.addressState.set('error'),
    });
  }

  saveProfile(): void {
    if (this.profile.invalid || this.busy()) return;
    this.profileMessage.set('');
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
        this.profileMessage.set(err.error?.message || 'ACCOUNT.PROFILE_ERROR');
      },
    });
  }

  saveAddress(editor: HTMLDetailsElement): void {
    if (this.address.invalid || this.busy()) return;
    this.addressMessage.set('');
    this.busy.set(true);
    this.addressService.addAddress(this.address.getRawValue()).subscribe({
      next: (res) => {
        this.addresses.set(res.data);
        this.address.reset();
        this.busy.set(false);
        editor.open = false;
        editor.querySelector('summary')?.focus();
        this.addressMessage.set('ACCOUNT.ADDRESS_SAVED');
      },
      error: (err) => {
        this.busy.set(false);
        this.addressMessage.set(err.error?.message || 'ACCOUNT.SAVE_ERROR');
      },
    });
  }

  removeAddress(id: string): void {
    if (this.busy()) return;
    this.addressMessage.set('');
    this.busy.set(true);
    this.addressService.removeAddress(id).subscribe({
      next: () => {
        this.addresses.update((list) => list.filter((address) => address._id !== id));
        this.busy.set(false);
        this.removingId.set('');
        this.addressMessage.set('ACCOUNT.ADDRESS_REMOVED');
      },
      error: () => {
        this.busy.set(false);
        this.addressMessage.set('ACCOUNT.REMOVE_ERROR');
      },
    });
  }
}
