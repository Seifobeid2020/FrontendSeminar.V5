import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../report.service';
import { AdvanceReport } from './advance-report.model';

@Component({
  selector: 'app-advance-report',
  templateUrl: './advance-report.component.html',
  styleUrls: ['./advance-report.component.css'],
})
export class AdvanceReportComponent implements OnInit {
  reports: AdvanceReport[];

  statuses: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  totalAmount: number = 0;

  @ViewChild('advanceReportTable', { static: true }) advanceReportTable;

  constructor(
    private reportService: ReportService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.reportService.getAdvanceReports().then((reports) => {
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
    if (event.filteredValue) {
      this.totalAmount = 0;
      event.filteredValue.forEach((report) => {
        this.totalAmount += report.balance;
      });
    }
  }
}
