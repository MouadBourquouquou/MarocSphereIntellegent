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
        // Read role from the response directly; tap() in AuthService stores it too
        const raw: string = response?.role ?? this.authService.currentUser()?.role ?? '';
        const role = raw.toUpperCase().replace('ROLE_', '');
        const dashboardRoutes: Record<string, string> = {
          CLIENT:  '/dashboard-client',
          ARTISAN: '/dashboard-artisan',
          GUIDE:   '/dashboard-guide',
          ADMIN:   '/admin',
          DMC:     '/dashboard-dmc',
        };
        const destination = dashboardRoutes[role] ?? '/landing';
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
