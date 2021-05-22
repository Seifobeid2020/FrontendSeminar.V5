import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PatientService } from '../patient/patient.service';
import { RadiologistService } from '../radiologist.service';
import { TreatmentType } from '../shared/models/treatment-type.model';

@Component({
  selector: 'app-treatment-type',
  templateUrl: './treatment-type.component.html',
  styleUrls: ['./treatment-type.component.css'],
})
export class TreatmentTypeComponent implements OnInit {
  sub: Subscription;

  treatmentTypes: TreatmentType[];
  treatmentType: TreatmentType;

  treatmentTypeDialog: boolean;
  submitted: boolean;

  isEditMode: boolean = false;
  selectedTreatmentTypes: TreatmentType[];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private radiologistService: RadiologistService
  ) {}

  ngOnInit(): void {
    this.radiologistService.getTreatmentTypes().then((data) => {
      console.log(data);
      this.treatmentTypes = data;
    });

    this.sub = this.radiologistService.treatmentTypeChanged.subscribe(
      (response) => {
        const arr = this.treatmentTypes.filter(
          (p) => p.treatmentTypeId == response.treatmentTypeId
        );
        if (arr.length > 0) {
          var indexOfModefied = this.treatmentTypes.findIndex(
            (p) => p.treatmentTypeId == response.treatmentTypeId
          );
          this.treatmentTypes[indexOfModefied] = response;
        } else {
          this.treatmentTypes = [response, ...this.treatmentTypes];
        }
      }
    );
  }
  openNew() {
    this.treatmentType = {
      userId: '',
      name: '',
      defaultCost: 0,
    };
    this.submitted = false;
    this.treatmentTypeDialog = true;
    this.isEditMode = false;
  }

  editTreatmentType(treatmentType: TreatmentType) {
    this.treatmentType = { ...treatmentType };
    this.treatmentTypeDialog = true;
    this.isEditMode = true;
  }

  deleteTreatmentType(treatmentType: TreatmentType) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + treatmentType.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.treatmentTypes = this.treatmentTypes.filter(
          (val) => val.treatmentTypeId !== treatmentType.treatmentTypeId
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Patient Deleted',
          life: 1500,
        });
        this.radiologistService.deleteTreatmentType(
          treatmentType.treatmentTypeId
        );
      },
    });
  }

  saveTreatmentType() {
    this.submitted = true;
    // if (this.treatmentType. && this.patient.firstName.trim()) {
    // if edit
    if (this.isEditMode) {
      console.log('Hiii from edit!!');
      console.log(this.treatmentType);
      this.radiologistService.editTreatmentType(
        this.treatmentType.treatmentTypeId,
        this.treatmentType
      );
      this.treatmentTypeDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Patient Updated',
        life: 1500,
      });
    }
    // if add
    else {
      this.isEditMode = false;

      let newTreatmentType: TreatmentType = {
        userId: '',
        name: this.treatmentType.name,
        defaultCost: this.treatmentType.defaultCost,
      };
      this.radiologistService.craeteTreatmentType(newTreatmentType);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Patient Created',
        life: 1500,
      });
      this.treatmentTypeDialog = false;
    }
    // }
  }

  hideDialog() {
    this.treatmentTypeDialog = false;
    this.submitted = false;
    // this.isEditMode = false;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
