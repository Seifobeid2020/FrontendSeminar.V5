import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';
import firebase from 'firebase';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('formEditProfile', { static: true }) formEditProfile: NgForm;
  @ViewChild('password', { static: true }) password: NgModule;
  @ViewChild('passwordConfirm', { static: true }) passwordConfirm: NgModule;

  changePasswordForm: FormGroup;

  userData: any;
  inEditUserData;
  isEditMode: boolean = false;
  editUserPhotoDialog: boolean = false;
  changePasswordDialog: boolean = false;
  user;
  selectedCity;
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Upload Image %%%%%%%%%%%%%%%%%%%%%%%%%%%
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  fileName = '';
  private basePath = '/profileImages';
  uploadProgress$: Observable<number>;
  constructor(
    private authService: AuthService,
    private angularFirestore: AngularFirestore,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}
  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}'
        ),
      ]),
      passwordConfirm: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}'
        ),
      ]),
    });
    this.userData = this.authService.getUser();
    this.inEditUserData = { ...this.userData };
    this.user = firebase.auth().currentUser;
    this.angularFirestore
      .collection('users')
      .doc(this.userData.uid)
      .get()
      .subscribe((data: any) => {
        this.userData.city = data.data().city;
        this.userData.phoneNumber = data.data().phoneNumber;
        this.inEditUserData = { ...this.userData };

        this.selectedCity = {
          value: this.inEditUserData.city,
          name: this.inEditUserData.city,
        };

        console.log(this.selectedCity);
      });
  }
  onClickEditUserDetails() {
    this.isEditMode = true;
  }
  onClickCancelEdit() {
    this.isEditMode = false;

    this.inEditUserData = { ...this.userData };
    console.log(this.selectedCity);
    this.selectedCity = {
      value: this.inEditUserData.city,
      name: this.inEditUserData.city,
    };
  }
  hideDialog() {
    this.editUserPhotoDialog = false;
    // this.submitted = false;
    this.isEditMode = false;
    this.changePasswordDialog = false;
  }
  hideChangePasswordDialog() {
    // this.editUserPhotoDialog = false;
    // // this.submitted = false;
    // this.isEditMode = false;
    this.changePasswordDialog = false;
    console.log(this.changePasswordForm.get('password'));
    this.changePasswordForm.get('password').setValue(null);
    this.changePasswordForm.get('password').setErrors(null);
    this.changePasswordForm.get('passwordConfirm').setValue(null);
    this.changePasswordForm.get('passwordConfirm').setErrors(null);
    // this.changePasswordForm.;
  }
  //Dialog Part

  //  Change & Upload Image
  async saveImageProfile() {
    // await this.upload().then((fileUpload) => {});
    console.log('selectedFiles: ', this.selectedFiles.item(0));
    let fileUpload: any = this.selectedFiles.item(0);
    const filePath = `${this.basePath}/${this.userData.uid}/${fileUpload.name}`;
    const uploadTask = this.storage.upload(filePath, fileUpload);

    const fileRef = this.storage.ref(filePath);
    // const task = this.storage.upload(filepath, this.selectedImage);

    this.uploadProgress$ = uploadTask.percentageChanges();

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            // this.upSvc.insertImageDetails(this.daydetails.value);
            // this.toaster.success('Submitted successfully');
            // this.router.navigate(['../Home'], {
            //   relativeTo: this.activatedroute,
            // });
            var testUser = this.userData;

            this.user
              .updateProfile({
                photoURL: url,
              })
              .then(function () {
                // Update successful.

                testUser.photoURL = url;
              })
              .catch(function (error) {
                // An error happened.
                console.log(error);
              });
            this.angularFirestore.collection('users').doc(testUser.uid).update({
              photoURL: url,
            });
            this.isEditMode = false;
            this.editUserPhotoDialog = false;
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
  //  Change & Upload Password

  onSaveChangePassword() {
    console.log(this.passwordConfirm);
    console.log(this.password);

    this.user
      .updatePassword(this.changePasswordForm.get('password').value)
      .then((s) => console.log(s))
      .catch((err) => console.log(err));
    this.changePasswordDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Changed The Password',
      life: 1500,
    });
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles.item(0).name;
    console.log(this.selectedFiles.item(0));
  }
  //
  //
  ///
  //
  //
  //
  //
  onClickSaveUserDetailsChanges() {
    if (this.formEditProfile.valid) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to Update User Details?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          //Update Email if changed
          if (
            this.formEditProfile.controls.email.dirty &&
            this.inEditUserData.email != this.userData.email
          ) {
            console.log('edit the email');
            this.userData.email = this.inEditUserData.email;

            this.user
              .updateEmail(this.userData.email)
              .then((s) => console.log(s))
              .catch((err) => console.log(err));
            this.angularFirestore
              .collection('users')
              .doc(this.userData.uid)
              .update({
                email: this.userData.email,
              });
          }
          //Update phoneNumber if changed

          if (
            this.formEditProfile.controls.phoneNumber.dirty &&
            this.inEditUserData.phoneNumber != this.userData.phoneNumber
          ) {
            console.log('edit the phoneNumber');
            this.userData.phoneNumber = this.inEditUserData.phoneNumber;

            // this.user
            //   .updatePhoneNumber(this.userData.phoneNumber)
            //   .then((s) => console.log(s))
            //   .catch((err) => console.log(err));
            this.angularFirestore
              .collection('users')
              .doc(this.userData.uid)
              .update({
                phoneNumber: this.userData.phoneNumber,
              });
          }
          //Update displayName if changed

          if (
            this.formEditProfile.controls.displayName.dirty &&
            this.inEditUserData.displayName != this.userData.displayName
          ) {
            console.log('edit the displayName');
            this.userData.displayName = this.inEditUserData.displayName;
            this.user
              .updateProfile({ displayName: this.userData.displayName })
              .then((s) => console.log(s))
              .catch((err) => console.log(err));
            this.angularFirestore
              .collection('users')
              .doc(this.userData.uid)
              .update({
                displayName: this.userData.displayName,
              });
          }
          //Update city if changed

          if (
            this.formEditProfile.controls.city.dirty &&
            this.inEditUserData.city != this.userData.city
          ) {
            console.log('edit the city');
            this.userData.city = this.inEditUserData.city;
            this.angularFirestore
              .collection('users')
              .doc(this.userData.uid)
              .update({
                city: this.userData.city,
              });
          }

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
  }
  onClickChangePassword() {
    this.changePasswordDialog = true;
    this.changePasswordForm.get('password').setValue(null);
    this.changePasswordForm.get('password').setErrors(null);
    this.changePasswordForm.get('passwordConfirm').setValue(null);
    this.changePasswordForm.get('passwordConfirm').setErrors(null);
  }
  onClickOpenEditUserPhoto() {
    this.editUserPhotoDialog = true;
    this.selectedFiles = null;
    this.fileName = null;
  }
  onSubmit(event: NgForm) {
    console.log(event.form);
  }
  onChangePassword() {
    console.log();
  }
  onChangeCity() {
    console.log(this.selectedCity);
    this.inEditUserData.city = this.selectedCity.name;
  }
  onPasswordSubmit() {
    console.log(this.changePasswordForm);
  }
  cities: any[] = [
    { value: 'Jerusalem', name: 'Jerusalem' },
    { value: 'Bethlehem', name: 'Bethlehem' },
    { value: 'Rammalah', name: 'Rammalah' },
    { value: 'Gaza', name: 'Gaza' },
    { value: 'Hebron', name: 'Hebron' },
    { value: 'Jenin', name: 'Jenin' },
    { value: 'Jericho', name: 'Jericho' },
    { value: 'KhanYunis', name: 'KhanYunis' },
    { value: 'Nablus', name: 'Nablus' },
    { value: 'Qalqilya', name: 'Qalqilya' },
    { value: 'Tulkarm', name: 'Tulkarm' },
    { value: 'Tubas', name: 'Tubas' },
    { value: 'Rafah', name: 'Rafah' },
    { value: 'Salfit', name: 'Salfit' },
  ];
}
