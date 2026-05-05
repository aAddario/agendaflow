package com.agendaflow.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false)
  private Client client;
  @ManyToOne(optional = false)
  @JoinColumn(name = "service_item_id")
  private ServiceItem serviceItem;
  private LocalDateTime startTime;
  private LocalDateTime endTime;
  @Enumerated(EnumType.STRING)
  private AppointmentStatus status = AppointmentStatus.SCHEDULED;
  private String notes;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @PrePersist
  void prePersist() {
    createdAt = LocalDateTime.now();
    updatedAt = createdAt;
  }

  @PreUpdate
  void preUpdate() {
    updatedAt = LocalDateTime.now();
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Client getClient() { return client; }
  public void setClient(Client client) { this.client = client; }
  public ServiceItem getServiceItem() { return serviceItem; }
  public void setServiceItem(ServiceItem serviceItem) { this.serviceItem = serviceItem; }
  public LocalDateTime getStartTime() { return startTime; }
  public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
  public LocalDateTime getEndTime() { return endTime; }
  public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
  public AppointmentStatus getStatus() { return status; }
  public void setStatus(AppointmentStatus status) { this.status = status; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
}

