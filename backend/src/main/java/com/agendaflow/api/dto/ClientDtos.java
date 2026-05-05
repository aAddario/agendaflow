package com.agendaflow.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ClientDtos {
  public record ClientRequest(@NotBlank String name, @NotBlank String phone, @Email String email, String notes) {}
  public record ClientResponse(Long id, String name, String phone, String email, String notes) {}
}

