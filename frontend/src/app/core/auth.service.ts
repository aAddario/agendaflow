import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService, private router: Router) {}

  get token() {
    return localStorage.getItem('agendaflow_token');
  }

  get isAuthenticated() {
    return Boolean(this.token);
  }

  login(email: string, password: string) {
    return this.api.login({ email, password }).pipe(tap(response => this.persist(response)));
  }

  register(name: string, email: string, password: string) {
    return this.api.register({ name, email, password }).pipe(tap(response => this.persist(response)));
  }

  logout() {
    localStorage.removeItem('agendaflow_token');
    localStorage.removeItem('agendaflow_user');
    this.router.navigateByUrl('/login');
  }

  private persist(response: AuthResponse) {
    localStorage.setItem('agendaflow_token', response.token);
    localStorage.setItem('agendaflow_user', JSON.stringify(response.user));
  }
}
