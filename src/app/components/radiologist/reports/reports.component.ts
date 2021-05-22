import { Report } from './report.model';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ReportService } from './report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  reports: Report[];

  statuses: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  totalAmount: number = 0;

  // @ViewChild('reportTable', { static: true }) reportTable;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getReports().then((reports) => {
      this.reports = reports;
      this.loading = false;

      this.reports.forEach((report) => {
        this.totalAmount += report.balance;
        report.date = new Date(report.date);
      });
    });
  }

  balanceStyle(balance) {
    return balance < 0 ? true : false;
  }
  changeTotalBalance(event) {
    console.log(event);
    if (event.filteredValue) {
      this.totalAmount = 0;
      event.filteredValue.forEach((report) => {
        this.totalAmount += report.balance;
      });
    }
  }
  onClean(event) {
    console.log(event);
  }
}
