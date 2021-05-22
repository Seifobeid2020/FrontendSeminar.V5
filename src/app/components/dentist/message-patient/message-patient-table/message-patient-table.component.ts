import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { MessagePatientService } from '../message-patient.service';

import { MessagePatient } from '../../shared/message-patient.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-patient-table',
  templateUrl: './message-patient-table.component.html',
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  styleUrls: ['./message-patient-table.component.css'],
})
export class MessagePatientTableComponent implements OnInit, OnDestroy {
  sub: Subscription;

  messagePatients: MessagePatient[] = [];
  userUID;
  first = true;
  constructor(
    private messagePatientService: MessagePatientService,
    private auth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.auth.onAuthStateChanged((user) => {
      console.log(user.uid);
      this.userUID = user.uid;
    });
  }

  async ngOnInit() {
    // await this.messagePatientService
    //   .getMessages(this.userUID)
    //   .then((e) => {
    //     e.subscribe((events) => {
    //       var arr = [];

    //       events.forEach((change: any) => {
    //         if (change.type == 'added') {
    //           let tempMessage: any = change.payload.doc.data();
    //           tempMessage.messageId = change.payload.doc.id;
    //           arr = [tempMessage, ...arr];
    //         } else if (change.type == 'modified') {
    //         }
    //       });

    //       if (arr.length !== 0) {
    //         arr.sort((a, b) => {
    //           return b.sentAt - a.sentAt;
    //         });

    //         if (this.first) {
    //           this.messagePatients = [...arr];
    //           this.first = false;
    //         } else {
    //           this.messagePatients = [arr[0], ...this.messagePatients];
    //         }
    //         console.log('this is message arr:', this.messagePatients);
    //       }
    //     });
    //   })
    //   .catch((e) => console.log('waitting for id'));

    let arr = [];
    await this.auth.onAuthStateChanged((user) => {
      this.sub = this.afs
        .collection('messages', (ref) =>
          ref.where('receiverId', '==', user.uid)
        )
        .snapshotChanges()
        .subscribe((events) => {
          arr = [];

          events.forEach((change: any) => {
            if (change.type == 'added') {
              let tempMessage: any = change.payload.doc.data();
              tempMessage.messageId = change.payload.doc.id;
              arr = [tempMessage, ...arr];
            } else if (change.type == 'modified') {
            }
          });

          if (arr.length !== 0) {
            arr.sort((a, b) => {
              return b.sentAt - a.sentAt;
            });
            if (this.first) {
              this.messagePatients = [...arr];
              this.first = false;
            } else {
              this.messagePatients = [arr[0], ...this.messagePatients];
            }
          }
        });
    });
  }

  hideDialog() {}

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }
}
