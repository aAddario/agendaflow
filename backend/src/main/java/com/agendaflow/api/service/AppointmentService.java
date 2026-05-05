package com.agendaflow.api.service;

import com.agendaflow.api.dto.AppointmentDtos.*;
import com.agendaflow.api.entity.Appointment;
import com.agendaflow.api.entity.AppointmentStatus;
import com.agendaflow.api.exception.ApiException;
import com.agendaflow.api.repository.AppointmentRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {
  private final AppointmentRepository appointments;
  private final ClientService clientService;
  private final ServiceItemService serviceItemService;

  public AppointmentService(AppointmentRepository appointments, ClientService clientService, ServiceItemService serviceItemService) {
    this.appointments = appointments;
    this.clientService = clientService;
    this.serviceItemService = serviceItemService;
  }

  public List<AppointmentResponse> findAll(LocalDate date, AppointmentStatus status, Long clientId) {
    if (date != null) {
      return appointments.findByStartTimeBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay()).stream().map(this::toResponse).toList();
    }
    if (status != null) {
      return appointments.findByStatus(status).stream().map(this::toResponse).toList();
    }
    if (clientId != null) {
      return appointments.findByClientId(clientId).stream().map(this::toResponse).toList();
    }
    return appointments.findAll().stream().map(this::toResponse).toList();
  }

  public AppointmentResponse findById(Long id) {
    return toResponse(get(id));
  }

  public AppointmentResponse create(AppointmentRequest request) {
    var appointment = new Appointment();
    return saveWithRules(appointment, request);
  }

  public AppointmentResponse update(Long id, AppointmentRequest request) {
    return saveWithRules(get(id), request);
  }

  public AppointmentResponse cancel(Long id) {
    var appointment = get(id);
    appointment.setStatus(AppointmentStatus.CANCELLED);
    return toResponse(appointments.save(appointment));
  }

  public AppointmentResponse done(Long id) {
    var appointment = get(id);
    appointment.setStatus(AppointmentStatus.DONE);
    return toResponse(appointments.save(appointment));
  }

  public void delete(Long id) {
    appointments.delete(get(id));
  }

  Appointment get(Long id) {
    return appointments.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Appointment not found."));
  }

  AppointmentResponse toResponse(Appointment appointment) {
    return new AppointmentResponse(
        appointment.getId(),
        appointment.getClient().getId(),
        appointment.getClient().getName(),
        appointment.getServiceItem().getId(),
        appointment.getServiceItem().getName(),
        appointment.getStartTime(),
        appointment.getEndTime(),
        appointment.getStatus(),
        appointment.getNotes()
    );
  }

  private AppointmentResponse saveWithRules(Appointment appointment, AppointmentRequest request) {
    var client = clientService.get(request.clientId());
    var serviceItem = serviceItemService.get(request.serviceItemId());
    if (!Boolean.TRUE.equals(serviceItem.getActive())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Inactive service cannot be scheduled.");
    }
    var endTime = request.startTime().plusMinutes(serviceItem.getDurationMinutes());
    Long ignoredId = appointment.getId();
    if (appointments.existsConflict(ignoredId, request.startTime(), endTime)) {
      throw new ApiException(HttpStatus.CONFLICT, "There is already an appointment for this time.");
    }
    appointment.setClient(client);
    appointment.setServiceItem(serviceItem);
    appointment.setStartTime(request.startTime());
    appointment.setEndTime(endTime);
    appointment.setNotes(request.notes());
    if (appointment.getStatus() == null) {
      appointment.setStatus(AppointmentStatus.SCHEDULED);
    }
    return toResponse(appointments.save(appointment));
  }
}

