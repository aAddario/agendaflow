import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Appointment, AppointmentStatus, Client, ServiceItem } from '../../core/models';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <header class="page-header"><h1>Appointments</h1></header>
    <section class="grid-two">
      <form class="panel" [formGroup]="form" (ngSubmit)="save()">
        <h2>{{ editingId ? 'Edit appointment' : 'New appointment' }}</h2>
        <label>Client
          <select formControlName="clientId">
            @for (client of clients; track client.id) {
              <option [ngValue]="client.id">{{ client.name }}</option>
            }
          </select>
        </label>
        <label>Service
          <select formControlName="serviceItemId">
            @for (service of activeServices; track service.id) {
              <option [ngValue]="service.id">{{ service.name }} - {{ service.durationMinutes }} min</option>
            }
          </select>
        </label>
        <label>Start time <input type="datetime-local" formControlName="startTime"></label>
        <label>Notes <textarea formControlName="notes"></textarea></label>
        @if (error) { <p class="error">{{ error }}</p> }
        <button type="submit" [disabled]="form.invalid">Save</button>
        <button type="button" class="ghost" (click)="reset()">Clear</button>
      </form>
      <section class="panel">
        <div class="filters">
          <input type="date" [value]="dateFilter" (input)="setDate($any($event.target).value)">
          <select [value]="statusFilter" (change)="setStatus($any($event.target).value)">
            <option value="">All</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="DONE">Done</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <table>
          <thead><tr><th>When</th><th>Client</th><th>Service</th><th>Status</th><th></th></tr></thead>
          <tbody>
            @for (appointment of appointments; track appointment.id) {
              <tr>
                <td>{{ appointment.startTime | date:'short' }}</td>
                <td>{{ appointment.clientName }}</td>
                <td>{{ appointment.serviceName }}</td>
                <td><span class="badge">{{ appointment.status }}</span></td>
                <td class="actions">
                  <button type="button" (click)="edit(appointment)">Edit</button>
                  <button type="button" (click)="done(appointment)">Done</button>
                  <button type="button" class="danger" (click)="cancel(appointment)">Cancel</button>
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
      error: err => this.error = err.error?.message ?? 'Could not save appointment.'
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
}
