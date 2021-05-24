import { RadiologistService } from './../../radiologist.service';
import { Observable, Subscription } from 'rxjs';
import { PatientService } from './../patient.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../../shared/models/patient.model';
import { Treatment } from '../../shared/models/treatment.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TreatmentType } from '../../shared/models/treatment-type.model';

import { FileUpload } from './shared/file-upload.model';
import { FileUploadService } from './shared/file-upload.service';
import { MessagePatient } from 'src/app/components/dentist/shared/message-patient.model';
import { MessagePatientService } from 'src/app/components/dentist/message-patient/message-patient.service';
import { finalize, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/components/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
})
export class PatientDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private radiologistService: RadiologistService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private uploadService: FileUploadService,
    private db: AngularFireDatabase,
    private location: Location,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private http: HttpClient
  ) {}

  sub: Subscription;

  id: number;

  patientDetails: Patient;

  treatments: Treatment[];

  treatment: Treatment;

  selectedTreatments: Treatment[];

  treatmentTypes: TreatmentType[];

  selectedTreatmentType: TreatmentType;

  treatmentDialog: boolean;

  submitted: boolean;

  doctors: any;

  isEditMode = false;

  groupedDoctors;

  userData;
  //send items
  sendToDoctorDialog = false;
  selectedDoctor: string;
  //image upload
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  fileName = '';
  uploadProgress$: Observable<number>;
  private basePath = '/profileImages';
  // spinner
  showSpinner: boolean = false;

  isValidPanoramicImage: boolean = true;
  checkValueRecived: boolean = false;
  ngOnInit(): void {
    this.userData = this.authService.getUser();
    this.id = this.route.snapshot.params.id;
    this.patientService
      .getPatient(this.id)
      .then((data) => {
        this.patientDetails = data;
      })
      .catch((e) => {
        // this.router.navigate(['..'], { relativeTo: this.route });
        this.location.back();
        console.log(e);
      });

    this.radiologistService.getTreatmentTypes().then((response) => {
      this.treatmentTypes = response;

      this.selectedTreatmentType = { ...this.treatmentTypes[0] };
    });

    this.patientService
      .getTreatments(this.id)
      .then((data) => {
        this.treatments = data;
      })
      .catch((err) => console.log(err));

    this.sub = this.patientService.treatmentsChanged.subscribe((response) => {
      const arr = this.treatments.filter(
        (t) => t.treatmentId == response.treatmentId
      );
      if (arr.length > 0) {
        var indexOfModefied = this.treatments.findIndex(
          (p) => (p.treatmentId = response.treatmentId)
        );
        this.treatments[indexOfModefied] = response;
      } else {
        this.treatments = [response, ...this.treatments];
      }
    });

    // this.mService
    //   .getAllDoctors()
    //   .snapshotChanges()
    //   .pipe(
    //     map((actions) =>
    //       actions.map((a) => {
    //         const data = a.payload.doc.data() as object;
    //         const id = a.payload.doc.id;
    //         return { id, ...data };
    //       })
    //     )
    //   )
    //   .subscribe((data) => {
    //     data.forEach((item) => {
    //       this.doctors.push(item);
    //     });
    //     console.log(this.doctors);
    //   });

    this.radiologistService.getAllDoctors().then((data) => {
      this.groupedDoctors = data;
    });
  }

  openNew() {
    if (this.treatmentTypes.length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Treatment Type Needed',
        detail: 'Please Add Treatment Type from Settings ',
        life: 5000,
      });
      return;
    }
    this.showSpinner = false;
    this.treatment = { userId: '', treatmentCost: 0 };
    this.submitted = false;
    this.treatmentDialog = true;
    //check
    this.selectedFiles = null;
    this.fileName = null;
  }

  deleteTreatment(treatment: Treatment) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Treatment?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.treatments = this.treatments.filter(
          (val) => val.treatmentId !== treatment.treatmentId
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Treatment Deleted',
          life: 1500,
        });
        this.patientService.deleteTreatment(treatment.treatmentId);
        this.uploadService.deleteFileStorage(
          treatment.patientId + '/' + treatment.treatmentImageName
        );
      },
    });
  }

  deleteSelectedTreatments() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected treatments?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.treatments = this.treatments.filter(
          (val) => !this.selectedTreatments.includes(val)
        );
        this.selectedTreatments = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Patients Deleted',
          life: 1500,
        });
      },
    });
  }

  hideDialog() {
    this.treatmentDialog = false;
    this.submitted = false;
    this.isEditMode = false;
    this.sendToDoctorDialog = false;
  }
  async saveImageTreatment() {
    // let fileUpload: any = this.selectedFiles.item(0);
    // const filePath = `${this.basePath}/${this.userData.uid}/${fileUpload.name}`;
    // const uploadTask = this.storage.upload(filePath, fileUpload);
    // const fileRef = this.storage.ref(filePath);
    // this.uploadProgress$ = uploadTask.percentageChanges();
    // uploadTask.snapshotChanges().pipe(
    //   finalize(() => {
    //     fileRef.getDownloadURL().subscribe((url) => {
    //       let treatment: Treatment = {
    //         treatmentId: this.treatment.treatmentId,
    //         userId: '',
    //         patientId: this.id,
    //         treatmentImageUrl: url,
    //         treatmentImageName: fileUpload.name, // ask seif about it!!!
    //         treatmentCost: this.selectedTreatmentType.defaultCost,
    //         treatmentTypeId: this.selectedTreatmentType.treatmentTypeId,
    //         createdAt: this.treatment.createdAt,
    //       };
    //       this.patientService.editTreatment(
    //         this.treatment.treatmentId,
    //         treatment
    //       );
    //     });
    //   })
    // );
  }
  async saveTreatment() {
    this.submitted = true;
    if (!this.selectedFiles) {
      return;
    }

    // if edite
    if (this.isEditMode) {
      // await this.upload().then((fileUpload) => {
      //   let treatment: Treatment = {
      //     treatmentId: this.treatment.treatmentId,
      //     userId: '',
      //     patientId: this.id,
      //     treatmentImageUrl: fileUpload.url,
      //     treatmentImageName: fileUpload.name, // ask seif about it!!!
      //     treatmentCost: this.selectedTreatmentType.defaultCost,
      //     treatmentTypeId: this.selectedTreatmentType.treatmentTypeId,
      //     createdAt: this.treatment.createdAt,
      //   };

      //   this.patientService.editTreatment(
      //     this.treatment.treatmentId,
      //     treatment
      //   );

      // });
      let fileUpload: any = this.selectedFiles.item(0);
      const filePath = `${this.basePath}/${this.userData.uid}/${fileUpload.name}`;
      const uploadTask = this.storage.upload(filePath, fileUpload);
      const fileRef = this.storage.ref(filePath);
      this.uploadProgress$ = uploadTask.percentageChanges();

      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              let treatment: Treatment = {
                treatmentId: this.treatment.treatmentId,
                userId: '',
                patientId: this.id,
                treatmentImageUrl: url,
                treatmentImageName: fileUpload.name, // ask seif about it!!!
                treatmentCost: this.selectedTreatmentType.defaultCost,
                treatmentTypeId: this.selectedTreatmentType.treatmentTypeId,
                createdAt: this.treatment.createdAt,
              };

              this.patientService.editTreatment(
                this.treatment.treatmentId,
                treatment
              );
              this.isEditMode = false;
              this.treatmentDialog = false;
              this.uploadProgress$ = null;
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Patient Updated',
                life: 1500,
              });
            });
          })
        )
        .subscribe();
    }
    // if add
    else {
      //  await this.upload().then((fileUpload) => {
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

      //   });
      let fileUpload: any = this.selectedFiles.item(0);
      const filePath = `${this.basePath}/${this.userData.uid}/${fileUpload.name}`;
      const uploadTask = this.storage.upload(filePath, fileUpload);
      const fileRef = this.storage.ref(filePath);
      this.uploadProgress$ = uploadTask.percentageChanges();

      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              let newTreatment: Treatment = {
                userId: '',
                patientId: this.id,
                treatmentImageUrl: url,
                treatmentImageName: fileUpload.name, // ask seif about it!!!
                treatmentCost: this.selectedTreatmentType.defaultCost,
                treatmentTypeId: this.selectedTreatmentType.treatmentTypeId,
              };

              this.patientService.craeteTreatment(newTreatment);
              this.db
                .list(this.basePath + '/' + fileUpload.id)
                .push(fileUpload);
              this.isEditMode = false;
              this.treatmentDialog = false;
              this.uploadProgress$ = null;
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Patient Created',
                life: 1500,
              });
            });
          })
        )
        .subscribe();
    }

    // } end of first if
  }

  editTreatment(treatment: Treatment) {
    this.treatment = { ...treatment };
    this.treatmentDialog = true;
    this.isEditMode = true;
  }
  onChangeTreatmentType() {
    this.treatmentTypes.find((x) => {
      if (x.name == this.selectedTreatmentType.name) {
        this.selectedTreatmentType.defaultCost = x.defaultCost;
        return;
      }
    });
  }

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Upload Image %%%%%%%%%%%%%%%%%%%%%%%%%%%

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles.item(0).name;
  }
  async upload() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;
      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.currentFileUpload.id = this.id;

        return await this.uploadService.pushFileToStorage(
          this.currentFileUpload
        );

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
  //delete image
  deleteFileUpload(fileUpload: FileUpload): void {
    this.uploadService.deleteFile(fileUpload);
  }

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Send Image %%%%%%%%%%%%%%%%%%%%%%%%%%%
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Send Image %%%%%%%%%%%%%%%%%%%%%%%%%%%
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Send Image %%%%%%%%%%%%%%%%%%%%%%%%%%%
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Send Image %%%%%%%%%%%%%%%%%%%%%%%%%%%
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Send Image %%%%%%%%%%%%%%%%%%%%%%%%%%%
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Send Image %%%%%%%%%%%%%%%%%%%%%%%%%%%

  openDialogSendTreatmentToDoctor(treatment) {
    this.sendToDoctorDialog = true;
    // const message: MessagePatient = { imageUrl: treatment.url };
    // this.mService.createMessage(message);
    this.treatment = { ...treatment };
    this.isValidPanoramicImage = true;
    this.checkValueRecived = false;
    this.submitted = false;
  }

  onSendToDoctor() {
    if (!this.selectedDoctor) {
      this.submitted = true;
      return;
    }
    this.showSpinner = true;

    this.http
      .post('https://localhost:5021/gateway/image/validation', {
        imageURL: this.treatment.treatmentImageUrl,
        imageName: this.treatment.treatmentImageName,
      })
      .subscribe((result: any) => {
        //if true we need to send it
        if (result) {
          this.showSpinner = false;
          this.radiologistService.sendToDoctor(
            this.selectedDoctor,
            this.treatment,
            this.patientDetails
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Send To Doctor',
            life: 1500,
          });

          this.sendToDoctorDialog = false;
        }
        //if true we need to privent send message
        else {
          this.showSpinner = false;
          this.isValidPanoramicImage = false;
          this.checkValueRecived = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Not Valid Image ',
            detail: "Sorry We can't Sent it ",
            life: 3000,
          });
        }
      });

    return;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
