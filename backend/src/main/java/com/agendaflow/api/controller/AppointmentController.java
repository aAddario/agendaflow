package com.agendaflow.api.controller;

import com.agendaflow.api.dto.AppointmentDtos.*;
import com.agendaflow.api.entity.AppointmentStatus;
import com.agendaflow.api.service.AppointmentService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
  private final AppointmentService appointmentService;

  public AppointmentController(AppointmentService appointmentService) {
    this.appointmentService = appointmentService;
  }

  @GetMapping
  List<AppointmentResponse> findAll(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
      @RequestParam(required = false) AppointmentStatus status,
      @RequestParam(required = false) Long clientId
  ) {
    return appointmentService.findAll(date, status, clientId);
  }

  @GetMapping("/{id}")
  AppointmentResponse findById(@PathVariable Long id) { return appointmentService.findById(id); }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  AppointmentResponse create(@Valid @RequestBody AppointmentRequest request) { return appointmentService.create(request); }

  @PutMapping("/{id}")
  AppointmentResponse update(@PathVariable Long id, @Valid @RequestBody AppointmentRequest request) { return appointmentService.update(id, request); }

  @PatchMapping("/{id}/cancel")
  AppointmentResponse cancel(@PathVariable Long id) { return appointmentService.cancel(id); }

  @PatchMapping("/{id}/done")
  AppointmentResponse done(@PathVariable Long id) { return appointmentService.done(id); }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void delete(@PathVariable Long id) { appointmentService.delete(id); }
}

