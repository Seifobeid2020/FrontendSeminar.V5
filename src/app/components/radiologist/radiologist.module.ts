import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadiologistRoutingModule } from './radiologist-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { ExpenseComponent } from './expense/expense.component';
import { TreatmentTypeComponent } from './treatment-type/treatment-type.component';
import { ExpenseTypeComponent } from './expense-type/expense-type.component';

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
import { ConfirmationService, SharedModule } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RadiologistComponent } from './radiologist.component';
import { AdvanceReportComponent } from './reports/advance-report/advance-report.component';

//table dashboard
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartModule } from 'primeng/chart';
import { ClickOutsideModule } from 'ng-click-outside';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    ReportsComponent,
    ExpenseComponent,
    TreatmentTypeComponent,
    ExpenseTypeComponent,
    RadiologistComponent,
    AdvanceReportComponent,
    DashboardComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    RadiologistRoutingModule,
    FormsModule,
    //table
    ChartModule,
    ToastModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    ProgressBarModule,
    InputTextModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    SelectButtonModule,
    TableModule,
    //lay out
    CommonModule,
    RadiologistRoutingModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    PanelMenuModule,
    SharedModule,
    ClickOutsideModule,
  ],
  exports: [],
  providers: [MessageService, ConfirmationService],
})
export class RadiologistModule {}
