import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { AuthService } from '../../auth.service';
import { FileUploadService } from '../message-patient/message-patient-details/shared/file-upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userData: any;
  isEditMode: boolean = false;
  editUserPhotoDialog: boolean = false;
  changePasswordDialog: boolean = false;
  constructor(
    private authService: AuthService,
    private angularFirestore: AngularFirestore,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private uploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.getUser();

    this.angularFirestore
      .collection('users')
      .doc(this.userData.uid)
      .get()
      .subscribe((data: any) => (this.userData.city = data.data().city));
  }
  onClickEditUserDetails() {
    this.isEditMode = true;
  }
  onClickCancelEdit() {
    this.isEditMode = false;
  }
  hideDialog() {
    this.editUserPhotoDialog = false;
    // this.submitted = false;
    this.isEditMode = false;
    this.changePasswordDialog = false;
  }

  //Dialog Part
  //  Change & Upload Image
  async saveTreatment() {
    // if edite
    if (this.isEditMode) {
      await this.upload().then((fileUpload) => {
        // let treatment: Treatment = {
        //   treatmentId: this.treatment.treatmentId,
        //   userId: '',
        //   patientId: this.id,
        //   treatmentImageUrl: fileUpload.url,
        //   treatmentImageName: fileUpload.name, // ask seif about it!!!
        //   treatmentCost: this.selectedTreatmentType.defaultCost,
        //   treatmentTypeId: this.selectedTreatmentType.treatmentTypeId,
        //   createdAt: this.treatment.createdAt,
        // };
        // this.patientService.editTreatment(
        //   this.treatment.treatmentId,
        //   treatment
        // );
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Patient Updated',
        life: 1500,
      });
    }
    // if add
    else {
      await this.upload().then((fileUpload) => {
        // let newTreatment: Treatment = {
        //   userId: '',
        //   patientId: this.id,
        //   treatmentImageUrl: fileUpload.url,
        //   treatmentImageName: fileUpload.name, // ask seif about it!!!
        //   treatmentCost: this.selectedTreatmentType.defaultCost,
        //   treatmentTypeId: this.selectedTreatmentType.treatmentTypeId,
        // };
        // console.log('this is alll: ' + newTreatment);
        // this.patientService.craeteTreatment(newTreatment);
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Patient Created',
        life: 1500,
      });
    }

    this.isEditMode = false;
    this.editUserPhotoDialog = false;

    // } end of first if
  }

  //  Change & Upload Password

  onSaveChangePassword() {
    this.changePasswordDialog = false;

    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Changed The Password',
      life: 1500,
    });
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Upload Image %%%%%%%%%%%%%%%%%%%%%%%%%%%
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  fileName = '';

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles.item(0).name;
  }
  async upload() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;
      if (file) {
        // this.currentFileUpload = new FileUpload(file);
        // this.currentFileUpload.id = this.id;
        // return await this.uploadService.pushFileToStorage(
        //   this.currentFileUpload
        // );
        // .subscribe(
        //   (percentage) => {
        //     this.percentage = Math.round(percentage ? percentage : 0);
        //   },
        //   (error) => {
        //     console.log(error);
        //   }
        // );
      }
    }
  }
  //
  //
  ///
  //
  //
  //
  //
  onClickSaveChanges() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to Update User Details?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Details Updated',
          life: 1500,
        });
        this.isEditMode = false;
      },
    });
  }
  onClickChangePassword() {
    this.changePasswordDialog = true;
  }
  onClickOpenEditUserPhoto() {
    this.editUserPhotoDialog = true;
  }
}
