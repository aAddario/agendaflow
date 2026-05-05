package com.agendaflow.api.service;

import com.agendaflow.api.dto.ServiceItemDtos.*;
import com.agendaflow.api.entity.ServiceItem;
import com.agendaflow.api.exception.ApiException;
import com.agendaflow.api.repository.ServiceItemRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ServiceItemService {
  private final ServiceItemRepository services;

  public ServiceItemService(ServiceItemRepository services) {
    this.services = services;
  }

  public List<ServiceItemResponse> findAll() {
    return services.findAll().stream().map(this::toResponse).toList();
  }

  public ServiceItemResponse findById(Long id) {
    return toResponse(get(id));
  }

  public ServiceItemResponse create(ServiceItemRequest request) {
    return toResponse(services.save(apply(new ServiceItem(), request)));
  }

  public ServiceItemResponse update(Long id, ServiceItemRequest request) {
    return toResponse(services.save(apply(get(id), request)));
  }

  public void delete(Long id) {
    var service = get(id);
    service.setActive(false);
    services.save(service);
  }

  ServiceItem get(Long id) {
    return services.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Serviço não encontrado."));
  }

  private ServiceItem apply(ServiceItem service, ServiceItemRequest request) {
    service.setName(request.name());
    service.setDescription(request.description());
    service.setDurationMinutes(request.durationMinutes());
    service.setPrice(request.price());
    service.setActive(request.active() == null || request.active());
    return service;
  }

  private ServiceItemResponse toResponse(ServiceItem service) {
    return new ServiceItemResponse(service.getId(), service.getName(), service.getDescription(), service.getDurationMinutes(), service.getPrice(), service.getActive());
  }
}
