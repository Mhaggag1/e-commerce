import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Component, inject, signal } from '@angular/core';
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rePassword: ['', Validators.required],
  });
  readonly message = signal('');
  readonly saving = signal(false);
  changePassword(): void {
    if (this.form.invalid || this.saving()) return;
    const data = this.form.getRawValue();
    if (data.password !== data.rePassword) {
      this.message.set('The new passwords must match.');
      return;
    }
    this.saving.set(true);
    this.authService.changePassword(data).subscribe({
      next: (res) => {
        if (res.token) localStorage.setItem('token', res.token);
        this.form.reset();
        this.saving.set(false);
        this.message.set('Password changed.');
      },
      error: (err) => {
        this.saving.set(false);
        this.message.set(err.error?.message || 'Could not change password.');
      },
    });
  }
}
