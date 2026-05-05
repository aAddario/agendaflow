package com.agendaflow.api.dto;

import com.agendaflow.api.entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class AppointmentDtos {
  public record AppointmentRequest(@NotNull Long clientId, @NotNull Long serviceItemId, @NotNull LocalDateTime startTime, String notes) {}
  public record AppointmentResponse(
      Long id,
      Long clientId,
      String clientName,
      Long serviceItemId,
      String serviceName,
      LocalDateTime startTime,
      LocalDateTime endTime,
      AppointmentStatus status,
      String notes
  ) {}
}

