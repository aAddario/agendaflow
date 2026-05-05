import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Appointment, AppointmentStatus, AuthResponse, Client, DashboardSummary, ServiceItem } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(payload: { name: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload);
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, payload);
  }

  dashboard() {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/dashboard/summary`);
  }

  clients() {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`);
  }

  saveClient(client: Client) {
    return client.id
      ? this.http.put<Client>(`${this.apiUrl}/clients/${client.id}`, client)
      : this.http.post<Client>(`${this.apiUrl}/clients`, client);
  }

  deleteClient(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/clients/${id}`);
  }

  services() {
    return this.http.get<ServiceItem[]>(`${this.apiUrl}/services`);
  }

  saveService(service: ServiceItem) {
    return service.id
      ? this.http.put<ServiceItem>(`${this.apiUrl}/services/${service.id}`, service)
      : this.http.post<ServiceItem>(`${this.apiUrl}/services`, service);
  }

  deleteService(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/services/${id}`);
  }

  appointments(filters: { date?: string; status?: AppointmentStatus } = {}) {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`, { params: { ...filters } });
  }

  saveAppointment(appointment: Appointment) {
    return appointment.id
      ? this.http.put<Appointment>(`${this.apiUrl}/appointments/${appointment.id}`, appointment)
      : this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointment);
  }

  cancelAppointment(id: number) {
    return this.http.patch<Appointment>(`${this.apiUrl}/appointments/${id}/cancel`, {});
  }

  doneAppointment(id: number) {
    return this.http.patch<Appointment>(`${this.apiUrl}/appointments/${id}/done`, {});
  }
}

