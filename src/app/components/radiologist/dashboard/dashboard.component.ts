import { ExpenseDashboard } from './../shared/models/expense-dashboard.model';
import { PatientDashboard } from './../shared/models/patient-dashboard.model';
import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../shared/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  data: any;

  totalPatients: number = 0;

  totalExpanses: number = 0;

  totalIncomes: number = 0;

  newWeeklyPatientsCount: number = 0;

  lastFivePatients: PatientDashboard[];

  lastFiveExpenses: ExpenseDashboard[];

  constructor(private dashboardService: DashboardService) {
    this.dashboardService.getTotalExpanse().then((exp) => {
      this.dashboardService.getTotalIncomes().then((inc) => {
        this.data = {
          labels: ['Incomes', 'Expenses'],
          datasets: [
            {
              data: [inc, exp],
              backgroundColor: ['#36A2EB', '#FF6384'],
              hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
          ],
        };
      });
    });
  }

  ngOnInit(): void {
    this.dashboardService
      .getTotalPatientsCount()
      .then((data) => (this.totalPatients = data));
    this.dashboardService
      .getLastFivePatients()
      .then((patients) => (this.lastFivePatients = patients));
    this.dashboardService
      .getTotalExpanse()
      .then((expanses) => (this.totalExpanses = expanses));

    this.dashboardService
      .getNewWeeklyPatientsCount()
      .then((patients) => (this.newWeeklyPatientsCount = patients));
    this.dashboardService
      .getTotalIncomes()
      .then((incomes) => (this.totalIncomes = incomes));
    this.dashboardService
      .getLastFiveExpenses()
      .then((expenses) => (this.lastFiveExpenses = expenses));
  }
}
