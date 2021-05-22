import { ExpenseDashboard } from './models/expense-dashboard.model';
import { PatientDashboard } from './models/patient-dashboard.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = 'https://localhost:5021/gateway/Dashboard/';

  constructor(private http: HttpClient) {}

  getTotalPatientsCount(): Promise<number> {
    return this.http
      .get<number>(this.baseUrl + 'PatientCount')
      .toPromise()
      .then((data) => {
        //  console.log(data);
        return data;
      });
  }
  getTotalExpanse(): Promise<number> {
    return this.http
      .get<number>(this.baseUrl + 'TotalExpanse')
      .toPromise()
      .then((data) => {
        //   console.log(data);
        return data;
      });
  }
  getTotalIncomes(): Promise<number> {
    return this.http
      .get<number>(this.baseUrl + 'TotalIncomes')
      .toPromise()
      .then((data) => {
        //  console.log(data);
        return data;
      });
  }
  getNewWeeklyPatientsCount(): Promise<number> {
    return this.http
      .get<number>(this.baseUrl + 'NewWeeklyPatientsCount')
      .toPromise()
      .then((data) => {
        //console.log(data);
        return data;
      });
  }
  getLastFivePatients(): Promise<PatientDashboard[]> {
    return this.http
      .get<PatientDashboard[]>(this.baseUrl + 'LastFivePatients')
      .toPromise()
      .then((data) => {
        //    console.log(data);
        return data;
      });
  }
  getLastFiveExpenses(): Promise<ExpenseDashboard[]> {
    return this.http
      .get<ExpenseDashboard[]>(this.baseUrl + 'LastFiveExpenses')
      .toPromise()
      .then((data) => {
        // console.log(data);
        return data;
      });
  }
}
