import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <strong>AgendaFlow</strong>
      <nav>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/clients" routerLinkActive="active">Clients</a>
        <a routerLink="/services" routerLinkActive="active">Services</a>
        <a routerLink="/appointments" routerLinkActive="active">Appointments</a>
      </nav>
      <button type="button" class="ghost" (click)="auth.logout()">Logout</button>
    </aside>
  `
})
export class SidebarComponent {
  constructor(public auth: AuthService) {}
}

