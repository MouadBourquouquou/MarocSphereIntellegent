import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.form.value).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        const role: string = response?.role ?? '';
        const dashboardRoutes: Record<string, string> = {
          CLIENT: '/dashboard-client',
          ARTISAN: '/dashboard-artisan',
          GUIDE: '/dashboard-guide',
          ADMIN: '/dashboard-client',
        };
        const destination = dashboardRoutes[role.toUpperCase()] ?? '/dashboard-client';
        this.router.navigate([destination]);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message ?? 'Email ou mot de passe incorrect.';
        this.errorMessage.set(msg);
      },
    });
  }
}
