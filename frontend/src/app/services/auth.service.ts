import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  nationalite: string;
  languePreferee: string;
  role: string;
}

export interface AuthUser {
  email: string;
  role: string;
  token: string;
}

interface LoginResponse {
  token: string;
  email: string;
  role: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  currentUser = signal<AuthUser | null>(this.loadUser());
  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role ?? null);

  login(credentials: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          const user: AuthUser = {
            email: response.email,
            role: response.role,
            token: response.token,
          };
          this.currentUser.set(user);
          localStorage.setItem('auth_user', JSON.stringify(user));
        }),
      );
  }

  register(data: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('auth_user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.currentUser()?.token ?? null;
  }

  private loadUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('auth_user');
    return data ? (JSON.parse(data) as AuthUser) : null;
  }
}
