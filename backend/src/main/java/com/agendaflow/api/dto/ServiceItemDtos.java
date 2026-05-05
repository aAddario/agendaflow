package com.agendaflow.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ServiceItemDtos {
  public record ServiceItemRequest(
      @NotBlank String name,
      String description,
      @NotNull @Min(1) Integer durationMinutes,
      @NotNull @DecimalMin("0.00") BigDecimal price,
      Boolean active
  ) {}

  public record ServiceItemResponse(Long id, String name, String description, Integer durationMinutes, BigDecimal price, Boolean active) {}
}

