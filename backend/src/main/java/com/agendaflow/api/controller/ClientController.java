package com.agendaflow.api.controller;

import com.agendaflow.api.dto.ClientDtos.*;
import com.agendaflow.api.service.ClientService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
  private final ClientService clientService;

  public ClientController(ClientService clientService) {
    this.clientService = clientService;
  }

  @GetMapping
  List<ClientResponse> findAll() { return clientService.findAll(); }

  @GetMapping("/{id}")
  ClientResponse findById(@PathVariable Long id) { return clientService.findById(id); }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  ClientResponse create(@Valid @RequestBody ClientRequest request) { return clientService.create(request); }

  @PutMapping("/{id}")
  ClientResponse update(@PathVariable Long id, @Valid @RequestBody ClientRequest request) { return clientService.update(id, request); }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void delete(@PathVariable Long id) { clientService.delete(id); }
}

