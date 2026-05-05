import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { DashboardSummary } from '../../core/models';

@Component({
  standalone: true,
  imports: [DatePipe],
  template: `
    <header class="page-header">
      <h1>Painel</h1>
    </header>
    @if (summary) {
      <section class="metrics">
        <article><span>Clientes</span><strong>{{ summary.totalClients }}</strong></article>
        <article><span>Serviços ativos</span><strong>{{ summary.totalServices }}</strong></article>
        <article><span>Hoje</span><strong>{{ summary.appointmentsToday }}</strong></article>
        <article><span>Agendados</span><strong>{{ summary.scheduledAppointments }}</strong></article>
        <article><span>Concluídos</span><strong>{{ summary.doneAppointments }}</strong></article>
        <article><span>Cancelados</span><strong>{{ summary.cancelledAppointments }}</strong></article>
      </section>
      <section class="panel">
        <h2>Próximos agendamentos</h2>
        <table>
          <tbody>
            @for (appointment of summary.nextAppointments; track appointment.id) {
              <tr>
                <td>{{ appointment.startTime | date:'short' }}</td>
                <td>{{ appointment.clientName }}</td>
                <td>{{ appointment.serviceName }}</td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    }
  `
})
export class DashboardComponent implements OnInit {
  summary?: DashboardSummary;
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.dashboard().subscribe(summary => this.summary = summary);
  }
}
