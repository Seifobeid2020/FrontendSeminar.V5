import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PatientTableComponent } from './patient-table/patient-table.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientComponent } from './patient.component';

const routes: Routes = [
  {
    path: '',
    component: PatientComponent,
    children: [
      { path: '', component: PatientTableComponent, pathMatch: 'full' },
      { path: ':id', component: PatientDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
