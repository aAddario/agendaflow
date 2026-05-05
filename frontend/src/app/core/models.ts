export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Client {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface ServiceItem {
  id?: number;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}

export type AppointmentStatus = 'SCHEDULED' | 'CANCELLED' | 'DONE';

export interface Appointment {
  id?: number;
  clientId: number;
  clientName?: string;
  serviceItemId: number;
  serviceName?: string;
  startTime: string;
  endTime?: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface DashboardSummary {
  totalClients: number;
  totalServices: number;
  appointmentsToday: number;
  scheduledAppointments: number;
  doneAppointments: number;
  cancelledAppointments: number;
  nextAppointments: Appointment[];
}

