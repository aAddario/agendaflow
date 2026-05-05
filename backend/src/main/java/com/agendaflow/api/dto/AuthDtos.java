package com.agendaflow.api.dto;

import com.agendaflow.api.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {
  public record RegisterRequest(@NotBlank String name, @Email @NotBlank String email, @NotBlank String password) {}
  public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
  public record UserResponse(Long id, String name, String email, UserRole role) {}
  public record AuthResponse(String token, UserResponse user) {}
}

