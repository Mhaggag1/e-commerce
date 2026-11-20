import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginform: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],

    password: [
      '',
      [
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        Validators.required,
      ],
    ],
  });

  submitLogin(): void {
    if (this.loginform.valid) {
      console.log('Form submitted:', this.loginform.value);

      this.authService.signIn(this.loginform.value).subscribe({
        next: (res: any) => {
          console.log('Login response:', res);

          if (res?.token) {
            localStorage.setItem('token', res.token);
          }

          if (res?.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }

          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        },
        error: (err) => {
          console.error('Login error:', err);
        },
      });
    } else {
      console.log('Form is invalid');
      this.loginform.markAllAsTouched();
    }
  }
}
