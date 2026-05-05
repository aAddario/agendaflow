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
        <a routerLink="/dashboard" routerLinkActive="active">Painel</a>
        <a routerLink="/clients" routerLinkActive="active">Clientes</a>
        <a routerLink="/services" routerLinkActive="active">Serviços</a>
        <a routerLink="/appointments" routerLinkActive="active">Agendamentos</a>
      </nav>
      <button type="button" class="ghost" (click)="auth.logout()">Sair</button>
    </aside>
  `
})
export class SidebarComponent {
  constructor(public auth: AuthService) {}
}
