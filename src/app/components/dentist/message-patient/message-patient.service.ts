import { DoctorCityLabel } from './../../radiologist/patient/patient-details/shared/doctor-city-label.model';
import { AuthService } from './../../auth.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import firebase from 'firebase';
import { MessagePatient } from '../shared/message-patient.model';

@Injectable()
export class MessagePatientService implements OnInit {
  userData;
  user: firebase.User;
  messagesCollection: AngularFirestoreCollection<MessagePatient>;
  messages: MessagePatient[];
  messagesChanges = new BehaviorSubject<MessagePatient[]>([]);
  userUID;
  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private authService: AuthService
  ) {
    this.auth.onAuthStateChanged((user) => {
      this.userUID = user.uid;
    });
  }
  ngOnInit() {}

  // innet(userID) {
  //   this.messagesCollection = this.afs.collection<MessagePatient>(
  //     'messages',
  //     (ref) => ref.where('receiverId', '==', userID)
  //   );

  //   this.messagesCollection
  //     .snapshotChanges()
  //     .pipe(
  //       map((actions) =>
  //         actions.map((a) => {
  //           const data = a.payload.doc.data();
  //           const id = a.payload.doc.id;
  //           return { messageId: id, ...data };
  //         })
  //       )
  //     )
  //     .subscribe((data) => {
  //       this.messages = data;
  //       this.messagesChanges.next(this.messages.slice());
  //     });
  // }
  createMessage(message: MessagePatient) {
    message.seen = false;
    this.afs.collection('messages').add(message);
  }
  // async getMesseges() {
  //   const userId = await this.auth.currentUser.then((user) => {
  //     return user.uid;
  //   });
  //   return await this.afs
  //     .collection('messages', (ref) => ref.where('receiverId', '==', userId))
  //     .snapshotChanges()
  //     .subscribe((event) => event);
  // }

  async getUID() {
    let id;
    await this.auth.onAuthStateChanged((user) => {
      console.log('this is uid', user.uid);
      id = user.uid;
    });
    return id;
  }

  async getMessages(messageUID) {
    return await this.afs
      .collection('messages', (ref) =>
        ref.where('receiverId', '==', messageUID)
      )
      .snapshotChanges();

    // .subscribe((events) => {
    //   events.forEach((change: any) => {
    //     if (change.type == 'added') {
    //       let tempMessage: any = change.payload.doc.data();
    //       tempMessage.uid = change.payload.doc.id;
    //       // console.log(tempMessage);
    //       messagesArray.push(tempMessage);
    //     } else if (change.type == 'modified') {
    //     }
    //   });
    // });
  }
  async getMessage(messageUID) {
    console.log(messageUID);
    let message;
    // this.afs
    //   .collection('messages', (ref) => ref.where('uid', '==', messageUID))
    //   .get()
    //   .subscribe((e) => {
    //     e.docs.forEach((doc) => {
    //       console.log(doc.data());
    //     });
    //   });

    return this.afs.collection('messages').doc(messageUID).get();

    //  .then((test) => {
    //    test.docs.forEach((doc) => {
    //      console.log('this is doc:', doc.data());
    //    });
    //  })
  }
}
