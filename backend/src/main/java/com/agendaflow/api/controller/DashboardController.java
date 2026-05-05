package com.agendaflow.api.controller;

import com.agendaflow.api.dto.DashboardDtos.DashboardSummary;
import com.agendaflow.api.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
  private final DashboardService dashboardService;

  public DashboardController(DashboardService dashboardService) {
    this.dashboardService = dashboardService;
  }

  @GetMapping("/summary")
  DashboardSummary summary() {
    return dashboardService.summary();
  }
}

