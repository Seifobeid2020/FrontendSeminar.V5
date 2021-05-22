import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MessagePatientTableComponent } from './message-patient-table/message-patient-table.component';
import { MessagePatientDetailsComponent } from './message-patient-details/message-patient-details.component';
import { MessagePatientComponent } from './message-patient.component';

const routes: Routes = [
  {
    path: '',
    component: MessagePatientComponent,
    children: [
      { path: '', component: MessagePatientTableComponent, pathMatch: 'full' },
      { path: ':id', component: MessagePatientDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagePatientsRoutingModule {}
