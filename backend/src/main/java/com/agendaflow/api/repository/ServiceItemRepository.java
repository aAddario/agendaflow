package com.agendaflow.api.repository;

import com.agendaflow.api.entity.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
  long countByActiveTrue();
}

