import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  readonly passwordPattern = String.raw`(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*\-]).{8,}`;
  readonly form = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    rePassword: ['', Validators.required],
  });
  readonly message = signal('');
  readonly saving = signal(false);
  readonly showPasswords = signal(false);
  readonly failed = signal(false);
  private readonly confirmation = viewChild.required<ElementRef<HTMLInputElement>>('confirmation');

  get passwordsDiffer(): boolean {
    const { password, rePassword } = this.form.controls;
    return !!rePassword.value && rePassword.value !== password.value;
  }

  changePassword(): void {
    if (this.form.invalid || this.saving()) return;
    const data = this.form.getRawValue();
    if (this.passwordsDiffer) {
      this.form.controls.rePassword.markAsTouched();
      this.confirmation().nativeElement.focus();
      return;
    }
    this.message.set('');
    this.failed.set(false);
    this.saving.set(true);
    this.authService.changePassword(data).subscribe({
      next: (res) => {
        if (res.token) localStorage.setItem('token', res.token);
        this.form.reset();
        this.showPasswords.set(false);
        this.saving.set(false);
        this.message.set('PASSWORD.CHANGED');
      },
      error: (err) => {
        this.saving.set(false);
        this.failed.set(true);
        this.message.set(err.error?.message || 'PASSWORD.FAILED');
      },
    });
  }
}
