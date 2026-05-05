import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ErrorMessageComponent } from '../../shared/error-message.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ErrorMessageComponent],
  template: `
    <section class="auth-card">
      <h1>AgendaFlow</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Email <input type="email" formControlName="email"></label>
        <label>Senha <input type="password" formControlName="password"></label>
        <app-error-message [message]="error" />
        <button type="submit" [disabled]="form.invalid">Entrar</button>
      </form>
      <a routerLink="/register">Criar conta</a>
    </section>
  `
})
export class LoginComponent {
  error = '';
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.login(this.form.value.email ?? '', this.form.value.password ?? '').subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: () => this.error = 'Email ou senha inválidos.'
    });
  }
}
