import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { DashboardSummary } from '../../core/models';

@Component({
  standalone: true,
  imports: [DatePipe],
  template: `
    <header class="page-header">
      <h1>Dashboard</h1>
    </header>
    @if (summary) {
      <section class="metrics">
        <article><span>Clients</span><strong>{{ summary.totalClients }}</strong></article>
        <article><span>Active services</span><strong>{{ summary.totalServices }}</strong></article>
        <article><span>Today</span><strong>{{ summary.appointmentsToday }}</strong></article>
        <article><span>Scheduled</span><strong>{{ summary.scheduledAppointments }}</strong></article>
        <article><span>Done</span><strong>{{ summary.doneAppointments }}</strong></article>
        <article><span>Cancelled</span><strong>{{ summary.cancelledAppointments }}</strong></article>
      </section>
      <section class="panel">
        <h2>Next appointments</h2>
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
