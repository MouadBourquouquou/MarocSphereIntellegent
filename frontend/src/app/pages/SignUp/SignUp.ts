import { Component, inject, signal, effect } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
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

  cooperativeCheckStatus = signal<'idle' | 'checking' | 'found' | 'not-found'>('idle');
  cooperativeFoundName = signal<string>('');

  roles = ['CLIENT', 'ARTISAN'];
  languages = ['French', 'English', 'Arabic', 'Spanish'];
  tierOptions = ['BASIC', 'STANDARD', 'PREMIUM'];
  categorieOptions = [
    'Tapis',
    'Poterie',
    'Maroquinerie',
    'Bijouterie',
    'Broderie',
    'Menuiserie',
    'Zellige',
    'Autre',
  ];

  form: FormGroup = this.fb.group({
    prenom: ['', Validators.required],
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    telephone: ['', Validators.required],
    nationalite: ['Moroccan'],
    languePreferee: ['French'],
    tierAbonnement: ['BASIC'],
    categorieArtisanat: [''],
    eligibleExport: [false],
    independant: [true],
    cooperativeNom: [''],
  });

  constructor() {
    effect(() => {
      const role = this.selectedRole();
      const ctrl = this.form.get('categorieArtisanat')!;

      if (role === 'ARTISAN') {
        ctrl.setValidators(Validators.required);
      } else {
        ctrl.clearValidators();
      }

      ctrl.updateValueAndValidity();
    });

    this.form.get('cooperativeNom')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((nom: string) => {
          const trimmed = (nom ?? '').trim();
          if (!trimmed || this.isIndependant) {
            this.cooperativeCheckStatus.set('idle');
            return of(null);
          }

          this.cooperativeCheckStatus.set('checking');
          return this.authService.checkCooperativeNom(trimmed).pipe(
            catchError(() => {
              this.cooperativeCheckStatus.set('not-found');
              return of(null);
            }),
          );
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.cooperativeCheckStatus.set('found');
          this.cooperativeFoundName.set(result.nom);
        }
      });
  }

  selectRole(role: string): void {
    this.selectedRole.set(role);
    this.errorMessage.set('');
  }

  selectLanguage(lang: string): void {
    this.selectedLanguage.set(lang);
    this.form.patchValue({ languePreferee: lang });
  }

  get isIndependant(): boolean {
    return this.form.get('independant')!.value === true;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const role = this.selectedRole();

    if (
      role === 'ARTISAN' &&
      !this.isIndependant &&
      this.cooperativeCheckStatus() !== 'found'
    ) {
      this.errorMessage.set('Veuillez saisir un nom de cooperative valide.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const base = {
      prenom: this.form.value.prenom,
      nom: this.form.value.nom,
      email: this.form.value.email,
      password: this.form.value.password,
      telephone: this.form.value.telephone,
      nationalite: this.form.value.nationalite,
      languePreferee: this.form.value.languePreferee,
      role,
    };

    let request: RegisterRequest = base;

    if (role === 'CLIENT') {
      request = { ...base, tierAbonnement: this.form.value.tierAbonnement };
    } else if (role === 'ARTISAN') {
      const independant: boolean = this.isIndependant;
      request = {
        ...base,
        categorieArtisanat: this.form.value.categorieArtisanat,
        eligibleExport: this.form.value.eligibleExport === true,
        independant,
        cooperativeNom: independant ? null : (this.form.value.cooperativeNom ?? null),
      };
    }

    this.authService.register(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Compte cree avec succes ! Redirection...');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg =
          err.error?.message ?? "Erreur lors de l'inscription. Veuillez reessayer.";
        this.errorMessage.set(msg);
      },
    });
  }
}
