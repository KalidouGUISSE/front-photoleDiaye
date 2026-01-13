import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import type { AuthResponse, LoginRequest, RegisterRequest, User, ProfileResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  isAuthenticated = signal(false);

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getAccessToken();
    if (token && !this.isTokenExpired(token)) {
      this.isAuthenticated.set(true);
      this.loadUserProfile();
    } else {
      this.clearTokens();
    }
  }

  register(data: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/register`, data);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data).pipe(
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
        this.isAuthenticated.set(true);
        this.loadUserProfile();
      })
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearTokens();
        this.isAuthenticated.set(false);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  private loadUserProfile(): void {
    this.http.get<ProfileResponse>(`${environment.apiUrl}/user/profile`).subscribe({
      next: (response) => {
        this.currentUserSubject.next(response.profile);
      },
      error: () => {
        this.clearTokens();
        this.isAuthenticated.set(false);
      }
    });
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isVIP(): boolean {
    return this.currentUserSubject.value?.role === 'VIP';
  }

  isModerator(): boolean {
    return this.currentUserSubject.value?.role === 'MODERATOR';
  }
}