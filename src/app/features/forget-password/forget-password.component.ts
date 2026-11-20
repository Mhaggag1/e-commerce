import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-forget-password',
  styleUrl: './forget-password.component.css',
  templateUrl: './forget-password.component.html',
})
export class ForgetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // !Flag
  currentStep = signal(1);

  // email form group
  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
  });
  // otp form group
  otpForm: FormGroup = this.fb.group({
    resetCode: ['', [Validators.required]],
  });
  // reset form group
  resetForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required]],
  });
  // submit email

  submmitEmail(): void {
    this.authService.forgetPassword(this.emailForm.value).subscribe({
      next: (res) => {
        console.log(res);
        // !change step
        this.currentStep.set(2);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  // submit otp
  submmitOtp(): void {
    this.authService.verifyCode(this.otpForm.value).subscribe({
      next: (res) => {
        console.log(res);
        // !change step
        this.currentStep.set(3);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  // submit reset password
  submmitNewPassword(): void {
    let payLoad = {
      email: this.emailForm.get('email')?.value,
      newPassword: this.resetForm.get('newPassword')?.value,
    };

    this.authService.resetPassword(payLoad).subscribe({
      next: (res) => {
        console.log(res);
        // !Navigate to home
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
