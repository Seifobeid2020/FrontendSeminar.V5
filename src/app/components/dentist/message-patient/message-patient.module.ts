import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { MessagePatientsRoutingModule } from './message-patients-routing.module';
import { SharedModule } from 'src/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MessagePatientComponent } from './message-patient.component';
import { MessagePatientTableComponent } from './message-patient-table/message-patient-table.component';
import { MessagePatientDetailsComponent } from './message-patient-details/message-patient-details.component';
import { FieldsetModule } from 'primeng/fieldset';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    MessagePatientComponent,
    MessagePatientTableComponent,
    MessagePatientDetailsComponent,
  ],
  imports: [
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    FormsModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    SelectButtonModule,
    MessagePatientsRoutingModule,
    SharedModule,
    RouterModule,
    ProgressSpinnerModule,
    FieldsetModule,
    NgImageFullscreenViewModule,
    FontAwesomeModule,
  ],

  providers: [MessageService, ConfirmationService],
})
export class PatientModule {}
