package com.agendaflow.api.controller;

import com.agendaflow.api.dto.ServiceItemDtos.*;
import com.agendaflow.api.service.ServiceItemService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
public class ServiceItemController {
  private final ServiceItemService serviceItemService;

  public ServiceItemController(ServiceItemService serviceItemService) {
    this.serviceItemService = serviceItemService;
  }

  @GetMapping
  List<ServiceItemResponse> findAll() { return serviceItemService.findAll(); }

  @GetMapping("/{id}")
  ServiceItemResponse findById(@PathVariable Long id) { return serviceItemService.findById(id); }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  ServiceItemResponse create(@Valid @RequestBody ServiceItemRequest request) { return serviceItemService.create(request); }

  @PutMapping("/{id}")
  ServiceItemResponse update(@PathVariable Long id, @Valid @RequestBody ServiceItemRequest request) { return serviceItemService.update(id, request); }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void delete(@PathVariable Long id) { serviceItemService.delete(id); }
}

