import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './SignUp.html',
})
export class SignUp {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  selectedRole = signal<string>('CLIENT');
  selectedLanguage = signal<string>('French');
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  roles = ['CLIENT', 'ARTISAN'];
  languages = ['French', 'English', 'Arabic', 'Spanish'];

  form: FormGroup = this.fb.group({
    prenom: ['', Validators.required],
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    telephone: ['', Validators.required],
    nationalite: ['Moroccan'],
    languePreferee: ['French'],
  });

  selectRole(role: string): void {
    this.selectedRole.set(role);
  }

  selectLanguage(lang: string): void {
    this.selectedLanguage.set(lang);
    this.form.patchValue({ languePreferee: lang });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const request: RegisterRequest = {
      ...this.form.value,
      role: this.selectedRole(),
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.successMessage.set('Compte créé avec succès ! Redirection...');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message ?? 'Erreur lors de l\'inscription. Veuillez réessayer.';
        this.errorMessage.set(msg);
      },
    });
  }
}
