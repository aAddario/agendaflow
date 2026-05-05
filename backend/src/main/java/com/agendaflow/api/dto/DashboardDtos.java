package com.agendaflow.api.dto;

import java.util.List;

public class DashboardDtos {
  public record DashboardSummary(
      long totalClients,
      long totalServices,
      long appointmentsToday,
      long scheduledAppointments,
      long doneAppointments,
      long cancelledAppointments,
      List<AppointmentDtos.AppointmentResponse> nextAppointments
  ) {}
}

