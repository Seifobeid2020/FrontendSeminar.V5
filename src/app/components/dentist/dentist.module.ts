import { MessagePatientService } from './message-patient/message-patient.service';
import { SharedModule } from './../../../shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DentistComponent } from './dentist.component';
import { DentistRoutingModule } from './dentist-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BadgeModule } from 'primeng/badge';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { GalleriaModule } from 'primeng/galleria';
import { ClickOutsideModule } from 'ng-click-outside';
import { TableModule } from 'primeng/table';
import { ProfileComponent } from './profile/profile.component';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
@NgModule({
  declarations: [DentistComponent, DashboardComponent, ProfileComponent],
  imports: [
    DentistRoutingModule,
    CommonModule,
    DentistRoutingModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    PanelMenuModule,
    SharedModule,
    BadgeModule,
    ClickOutsideModule,
    NgImageFullscreenViewModule,
    GalleriaModule,
    TableModule,
    ToastModule,
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
  ],

  providers: [MessagePatientService, MessageService, ConfirmationService],
})
export class DentistModule {}
