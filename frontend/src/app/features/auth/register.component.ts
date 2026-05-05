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
      <h1>Create account</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Name <input formControlName="name"></label>
        <label>Email <input type="email" formControlName="email"></label>
        <label>Password <input type="password" formControlName="password"></label>
        <app-error-message [message]="error" />
        <button type="submit" [disabled]="form.invalid">Register</button>
      </form>
      <a routerLink="/login">Already have an account</a>
    </section>
  `
})
export class RegisterComponent {
  error = '';
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.register(this.form.value.name ?? '', this.form.value.email ?? '', this.form.value.password ?? '').subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: () => this.error = 'Could not create account.'
    });
  }
}

