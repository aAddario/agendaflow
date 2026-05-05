package com.agendaflow.api.service;

import com.agendaflow.api.dto.AuthDtos.*;
import com.agendaflow.api.entity.User;
import com.agendaflow.api.entity.UserRole;
import com.agendaflow.api.exception.ApiException;
import com.agendaflow.api.repository.UserRepository;
import com.agendaflow.api.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
    this.users = users;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.authenticationManager = authenticationManager;
  }

  public AuthResponse register(RegisterRequest request) {
    if (users.existsByEmail(request.email())) {
      throw new ApiException(HttpStatus.CONFLICT, "Email já cadastrado.");
    }
    var user = new User();
    user.setName(request.name());
    user.setEmail(request.email());
    user.setPassword(passwordEncoder.encode(request.password()));
    user.setRole(UserRole.USER);
    users.save(user);
    return response(user);
  }

  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
    var user = users.findByEmail(request.email()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas."));
    return response(user);
  }

  private AuthResponse response(User user) {
    return new AuthResponse(jwtService.generate(user), new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole()));
  }
}
