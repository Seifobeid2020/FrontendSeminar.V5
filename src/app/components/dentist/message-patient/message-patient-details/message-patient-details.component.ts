import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

import { MessagePatientService } from './../message-patient.service';
import { MessagePatient } from './../../shared/message-patient.model';
import { HttpClient } from '@angular/common/http';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-patient-details',
  templateUrl: './message-patient-details.component.html',
  styleUrls: ['./message-patient-details.component.css'],
})
export class MessagePatientDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private messagePatientService: MessagePatientService,
    private http: HttpClient,
    private angularFirestore: AngularFirestore
  ) {}
  faRobot = faRobot;
  sub: Subscription;

  id;

  messagePatientDetails;

  imageAIUrl;

  imageAIReceived: boolean = false;

  showSpinner: boolean = false;

  imageObject: Array<any> = [
    {
      image: '',
      thumbImage: '',
      title: 'Hummingbirds are amazing creatures',
    },
  ];
  showFlag: boolean = false;
  selectedImageIndex: number = -1;

  currentIndex: any = -1;

  //send items
  imageAfterML: Array<any> = [
    {
      image: '',
      thumbImage: '',
      title: 'Hummingbirds are amazing creatures',
    },
  ];
  showFlagAfterML: boolean = false;
  currentIndexAfterML: any = -1;

  sending: boolean = false;

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.messagePatientService.getMessage(this.id).then((e) =>
        e.subscribe((f) => {
          this.messagePatientDetails = f.data();
          this.imageAIUrl = this.messagePatientDetails.imageUrlAfterAI;

          this.imageObject[0].image = this.messagePatientDetails.imageUrl;
          this.imageObject[0].thumbImage = 'Patient Image ';
          if (this.messagePatientDetails.imageUrlAfterAI) {
            this.imageAfterML[0].image =
              this.messagePatientDetails.imageUrlAfterAI;
            this.imageAfterML[0].thumbImage =
              'Patient Image After Machine Learning';
          }
        })
      );
    });
  }

  sendToAIConverter() {
    this.showSpinner = true;

    this.http
      .post('https://localhost:5021/gateway/image/', {
        imageURL: this.messagePatientDetails.imageUrl,
      })
      .subscribe((result: any) => {
        this.imageAIUrl = result;
        this.imageAfterML[0].image = result;
        this.imageAfterML[0].thumbImage =
          'Patient Image After Machine Learning';

        this.angularFirestore.collection('messages').doc(this.id).update({
          imageUrlAfterAI: result,
        });
        this.imageAIReceived = true;
        this.showSpinner = false;
      });
  }
  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

  showLightbox(index) {
    this.currentIndex = index;
    this.showFlag = true;
  }
  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }
  showLightboxAfterML(index) {
    this.currentIndexAfterML = index;
    this.showFlagAfterML = true;
  }

  closeEventHandlerAfterML() {
    this.showFlagAfterML = false;
    this.currentIndexAfterML = -1;
  }
}
