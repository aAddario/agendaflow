package com.agendaflow.api.repository;

import com.agendaflow.api.entity.Appointment;
import com.agendaflow.api.entity.AppointmentStatus;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
  @Query("""
      select count(a) > 0 from Appointment a
      where a.status <> com.agendaflow.api.entity.AppointmentStatus.CANCELLED
      and (:ignoredId is null or a.id <> :ignoredId)
      and :startTime < a.endTime
      and :endTime > a.startTime
      """)
  boolean existsConflict(@Param("ignoredId") Long ignoredId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

  long countByStatus(AppointmentStatus status);
  long countByStartTimeBetween(LocalDateTime start, LocalDateTime end);
  List<Appointment> findTop5ByStatusAndStartTimeAfterOrderByStartTimeAsc(AppointmentStatus status, LocalDateTime now);
  List<Appointment> findByStatus(AppointmentStatus status);
  List<Appointment> findByClientId(Long clientId);
  List<Appointment> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}

