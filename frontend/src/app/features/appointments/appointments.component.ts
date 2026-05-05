import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Appointment, AppointmentStatus, Client, ServiceItem } from '../../core/models';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <header class="page-header"><h1>Agendamentos</h1></header>
    <section class="grid-two">
      <form class="panel" [formGroup]="form" (ngSubmit)="save()">
        <h2>{{ editingId ? 'Editar agendamento' : 'Novo agendamento' }}</h2>
        <label>Cliente
          <select formControlName="clientId">
            @for (client of clients; track client.id) {
              <option [ngValue]="client.id">{{ client.name }}</option>
            }
          </select>
        </label>
        <label>Serviço
          <select formControlName="serviceItemId">
            @for (service of activeServices; track service.id) {
              <option [ngValue]="service.id">{{ service.name }} - {{ service.durationMinutes }} min</option>
            }
          </select>
        </label>
        <label>Início <input type="datetime-local" formControlName="startTime"></label>
        <label>Observações <textarea formControlName="notes"></textarea></label>
        @if (error) { <p class="error">{{ error }}</p> }
        <button type="submit" [disabled]="form.invalid">Salvar</button>
        <button type="button" class="ghost" (click)="reset()">Limpar</button>
      </form>
      <section class="panel">
        <div class="filters">
          <input type="date" [value]="dateFilter" (input)="setDate($any($event.target).value)">
          <select [value]="statusFilter" (change)="setStatus($any($event.target).value)">
            <option value="">Todos</option>
            <option value="SCHEDULED">Agendado</option>
            <option value="DONE">Concluído</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
        <table>
          <thead><tr><th>Quando</th><th>Cliente</th><th>Serviço</th><th>Status</th><th></th></tr></thead>
          <tbody>
            @for (appointment of appointments; track appointment.id) {
              <tr>
                <td>{{ appointment.startTime | date:'short' }}</td>
                <td>{{ appointment.clientName }}</td>
                <td>{{ appointment.serviceName }}</td>
                <td><span class="badge">{{ statusLabel(appointment.status) }}</span></td>
                <td class="actions">
                  <button type="button" (click)="edit(appointment)">Editar</button>
                  <button type="button" (click)="done(appointment)">Concluir</button>
                  <button type="button" class="danger" (click)="cancel(appointment)">Cancelar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    </section>
  `
})
export class AppointmentsComponent implements OnInit {
  clients: Client[] = [];
  services: ServiceItem[] = [];
  appointments: Appointment[] = [];
  editingId?: number;
  error = '';
  dateFilter = '';
  statusFilter = '';
  form = this.fb.nonNullable.group({
    clientId: [0, [Validators.required, Validators.min(1)]],
    serviceItemId: [0, [Validators.required, Validators.min(1)]],
    startTime: ['', Validators.required],
    notes: ['']
  });

  get activeServices() {
    return this.services.filter(service => service.active);
  }

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit() {
    this.api.clients().subscribe(clients => this.clients = clients);
    this.api.services().subscribe(services => this.services = services);
    this.load();
  }

  load() {
    const filters: { date?: string; status?: AppointmentStatus } = {};
    if (this.dateFilter) filters.date = this.dateFilter;
    if (this.statusFilter) filters.status = this.statusFilter as AppointmentStatus;
    this.api.appointments(filters).subscribe(appointments => this.appointments = appointments);
  }

  save() {
    this.error = '';
    const value = this.form.getRawValue();
    const payload: Appointment = {
      id: this.editingId,
      clientId: value.clientId,
      serviceItemId: value.serviceItemId,
      startTime: value.startTime,
      notes: value.notes
    };
    this.api.saveAppointment(payload).subscribe({
      next: () => { this.reset(); this.load(); },
      error: err => this.error = err.error?.message ?? 'Não foi possível salvar o agendamento.'
    });
  }

  edit(appointment: Appointment) {
    this.editingId = appointment.id;
    this.form.patchValue({
      clientId: appointment.clientId,
      serviceItemId: appointment.serviceItemId,
      startTime: appointment.startTime.slice(0, 16),
      notes: appointment.notes ?? ''
    });
  }

  cancel(appointment: Appointment) {
    if (appointment.id) this.api.cancelAppointment(appointment.id).subscribe(() => this.load());
  }

  done(appointment: Appointment) {
    if (appointment.id) this.api.doneAppointment(appointment.id).subscribe(() => this.load());
  }

  setDate(date: string) {
    this.dateFilter = date;
    this.load();
  }

  setStatus(status: string) {
    this.statusFilter = status;
    this.load();
  }

  reset() {
    this.editingId = undefined;
    this.form.reset({ clientId: 0, serviceItemId: 0, startTime: '', notes: '' });
  }

  statusLabel(status?: AppointmentStatus) {
    const labels: Record<AppointmentStatus, string> = {
      SCHEDULED: 'Agendado',
      DONE: 'Concluído',
      CANCELLED: 'Cancelado'
    };
    return status ? labels[status] : '';
  }
}
