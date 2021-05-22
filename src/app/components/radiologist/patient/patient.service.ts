import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Patient } from '../shared/models/patient.model';
import { TreatmentType } from '../shared/models/treatment-type.model';
import { Treatment } from '../shared/models/treatment.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  patientsChanged = new Subject<Patient>();
  treatmentsChanged = new Subject<Treatment>();

  // baseUrl = 'https://localhost:5001/';
  gatewayBaseUrl = 'https://localhost:5021/gateway/';

  constructor(private http: HttpClient) {}

  getPatients(): Promise<Patient[]> {
    return this.http
      .get<Patient[]>(this.gatewayBaseUrl + 'patients')
      .toPromise()
      .then((data) => {
        return data;
      });
  }

  getPatient(id: number): Promise<Patient> {
    return this.http
      .get<Patient>(this.gatewayBaseUrl + `patients/${id}`)
      .toPromise()
      .then((data) => {
        return data;
      });
  }
  editPatient(id: number, patient: Patient) {
    this.http
      .put<Patient>(this.gatewayBaseUrl + `patients/${id}`, patient)
      .subscribe((result) => {
        console.log(result);
        this.patientsChanged.next(result);
      });
  }
  deletePatient(id: number) {
    this.http.delete(this.gatewayBaseUrl + `patients/${id}`).subscribe();
  }

  // getTreatmentsTotalCost(patientId: number): number {
  //   let totalCost = 0;
  //   this.http
  //     .get<{ value: number }>(
  //       this.baseUrl + `api/treatments/patient/${patientId}/totalcost`
  //     )
  //     .toPromise()
  //     .then((data) => {
  //       totalCost = data.value;
  //     });

  //   return totalCost;
  // }

  createPatient(patient: Patient): void {
    this.http
      .post<Patient>(this.gatewayBaseUrl + 'patients', patient)
      .subscribe((result) => {
        this.patientsChanged.next(result);
      });
  }

  getTreatments(patientId: number) {
    return this.http
      .get<Treatment[]>(this.gatewayBaseUrl + `treatments/patient/${patientId}`)
      .toPromise()
      .then((data) => data);
  }

  craeteTreatment(treatment: Treatment): void {
    this.http
      .post<Treatment>(this.gatewayBaseUrl + 'treatments', treatment)
      .subscribe((result) => {
        this.treatmentsChanged.next(result);
      });
  }

  editTreatment(id: number, treatment: Treatment) {
    console.log(treatment);
    this.http
      .put<Treatment>(this.gatewayBaseUrl + `treatments/${id}`, treatment)
      .subscribe((result) => {
        this.treatmentsChanged.next(result);
      });
  }

  deleteTreatment(id: number) {
    this.http.delete(this.gatewayBaseUrl + `treatments/${id}`).subscribe();
  }
}
