package com.agendaflow.api.service;

import com.agendaflow.api.dto.DashboardDtos.DashboardSummary;
import com.agendaflow.api.entity.AppointmentStatus;
import com.agendaflow.api.repository.AppointmentRepository;
import com.agendaflow.api.repository.ClientRepository;
import com.agendaflow.api.repository.ServiceItemRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
  private final ClientRepository clients;
  private final ServiceItemRepository services;
  private final AppointmentRepository appointments;
  private final AppointmentService appointmentService;

  public DashboardService(ClientRepository clients, ServiceItemRepository services, AppointmentRepository appointments, AppointmentService appointmentService) {
    this.clients = clients;
    this.services = services;
    this.appointments = appointments;
    this.appointmentService = appointmentService;
  }

  public DashboardSummary summary() {
    var today = LocalDate.now();
    var next = appointments.findTop5ByStatusAndStartTimeAfterOrderByStartTimeAsc(AppointmentStatus.SCHEDULED, LocalDateTime.now())
        .stream().map(appointmentService::toResponse).toList();
    return new DashboardSummary(
        clients.count(),
        services.countByActiveTrue(),
        appointments.countByStartTimeBetween(today.atStartOfDay(), today.plusDays(1).atStartOfDay()),
        appointments.countByStatus(AppointmentStatus.SCHEDULED),
        appointments.countByStatus(AppointmentStatus.DONE),
        appointments.countByStatus(AppointmentStatus.CANCELLED),
        next
    );
  }
}

