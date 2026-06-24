import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  APP_ROLES,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile
} from '../../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API = environment.apiUrl;
  private readonly USER_KEY = 'cafetron_user';

  constructor(private http: HttpClient) {}

  // ── API calls ────────────────────────────────────────────────────

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API}/auth/register`, request
    ).pipe(
      tap(response => this.saveSession(response))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API}/auth/login`, request
    ).pipe(
      tap(response => this.saveSession(response))
    );
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API}/users/me`);
  }

  // ── Session management ───────────────────────────────────────────

  private saveSession(response: AuthResponse): void {
    const normalizedResponse: AuthResponse = {
      ...response,
      role: this.normalizeRole(response.role) || response.role,
    };
    // Save user profile details only (token value arrives as null from backend safely)
    localStorage.setItem(this.USER_KEY, JSON.stringify(normalizedResponse));
  }

  // Clears frontend memory state only
  cleanLocalSession(): void {
    localStorage.removeItem(this.USER_KEY);
    // Purges old legacy tokens left in client storage from previous git versions
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('cafetron_token');
    localStorage.removeItem('auth_token');
  }

  logout(): void {
    // Call backend to drop the HTTP Cookie via Max-Age = 0 setup
    this.http.post(`${this.API}/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.cleanLocalSession(),
      error: () => this.cleanLocalSession() // Fallback clean if offline
    });
  }

  private getStoredUser(): AuthResponse | null {
    const user = localStorage.getItem(this.USER_KEY);
    if (!user) return null;

    try {
      return JSON.parse(user) as AuthResponse;
    } catch {
      this.cleanLocalSession();
      return null;
    }
  }

  isLoggedIn(): boolean {
    // Session validity is defined by active cache existence instead of explicit raw tokens
    return this.getStoredUser() !== null;
  }

  getRole(): string | null {
    const role = this.getStoredUser()?.role;
    return role ? this.normalizeRole(role) : null;
  }

  getUserName(): string | null {
    return this.getStoredUser()?.name ?? null;
  }

  getUserEmail(): string | null {
    return this.getStoredUser()?.email ?? null;
  }

  hasRole(...roles: string[]): boolean {
    const role = this.getRole();
    return !!role && roles.includes(role);
  }

  getDefaultRoute(): string {
    switch (this.getRole()) {
      case APP_ROLES.admin:
        return '/admin';
      case APP_ROLES.vendor:
        return '/vendor/orders';
      default:
        return '/menu';
    }
  }

  private normalizeRole(role: string | null | undefined): string | null {
    if (!role) return null;
    const normalizedRole = String(role).replace(/^ROLE_/i, '').trim().toUpperCase();
    return normalizedRole === APP_ROLES.counter ? APP_ROLES.vendor : normalizedRole;
  }
}