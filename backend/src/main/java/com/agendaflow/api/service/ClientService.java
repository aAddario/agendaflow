package com.agendaflow.api.service;

import com.agendaflow.api.dto.ClientDtos.*;
import com.agendaflow.api.entity.Client;
import com.agendaflow.api.exception.ApiException;
import com.agendaflow.api.repository.ClientRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ClientService {
  private final ClientRepository clients;

  public ClientService(ClientRepository clients) {
    this.clients = clients;
  }

  public List<ClientResponse> findAll() {
    return clients.findAll().stream().map(this::toResponse).toList();
  }

  public ClientResponse findById(Long id) {
    return toResponse(get(id));
  }

  public ClientResponse create(ClientRequest request) {
    return toResponse(clients.save(apply(new Client(), request)));
  }

  public ClientResponse update(Long id, ClientRequest request) {
    return toResponse(clients.save(apply(get(id), request)));
  }

  public void delete(Long id) {
    clients.delete(get(id));
  }

  Client get(Long id) {
    return clients.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found."));
  }

  private Client apply(Client client, ClientRequest request) {
    client.setName(request.name());
    client.setPhone(request.phone());
    client.setEmail(request.email());
    client.setNotes(request.notes());
    return client;
  }

  private ClientResponse toResponse(Client client) {
    return new ClientResponse(client.getId(), client.getName(), client.getPhone(), client.getEmail(), client.getNotes());
  }
}

