import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideRouter, Routes } from '@angular/router';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app/app.component';
import { authGuard } from './app/core/auth.guard';
import { jwtInterceptor } from './app/core/jwt.interceptor';
import { LoginComponent } from './app/features/auth/login.component';
import { RegisterComponent } from './app/features/auth/register.component';
import { DashboardComponent } from './app/features/dashboard/dashboard.component';
import { ClientsComponent } from './app/features/clients/clients.component';
import { ServicesComponent } from './app/features/services/services.component';
import { AppointmentsComponent } from './app/features/appointments/appointments.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'clients', component: ClientsComponent, canActivate: [authGuard] },
  { path: 'services', component: ServicesComponent, canActivate: [authGuard] },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];

registerLocaleData(localePt);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' }
  ]
}).catch(err => console.error(err));
