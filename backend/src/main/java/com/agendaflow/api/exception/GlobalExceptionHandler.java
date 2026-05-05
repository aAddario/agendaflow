package com.agendaflow.api.exception;

import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(ApiException.class)
  ResponseEntity<ApiError> handleApi(ApiException ex) {
    return ResponseEntity.status(ex.getStatus()).body(new ApiError(ex.getStatus().value(), ex.getMessage(), LocalDateTime.now()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
        .map(error -> error.getField() + ": " + error.getDefaultMessage())
        .collect(Collectors.joining("; "));
    return ResponseEntity.badRequest().body(new ApiError(400, message, LocalDateTime.now()));
  }

  @ExceptionHandler(AuthenticationException.class)
  ResponseEntity<ApiError> handleAuthentication(AuthenticationException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(new ApiError(401, "Invalid credentials.", LocalDateTime.now()));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<ApiError> handleGeneric(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new ApiError(500, "Unexpected server error.", LocalDateTime.now()));
  }
}
