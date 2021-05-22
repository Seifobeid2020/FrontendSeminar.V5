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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) {}
  faRobot = faRobot;
  sub: Subscription;

  id: number;

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
  //send items

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
      this.messagePatientService.getMessage(this.id).then((e) =>
        e.subscribe((f) => {
          console.log(f.data());
          this.messagePatientDetails = f.data();
          this.imageObject[0].image = this.messagePatientDetails.imageUrl;
          this.imageObject[0].thumbImage = this.messagePatientDetails.imageUrl;
        })
      );
    });
  }

  sendToAIConverter() {
    this.showSpinner = true;
    this.http
      .post('http://localhost:8000/api/image/', {
        imageURL: this.messagePatientDetails.imageUrl,
      })
      .subscribe((result: any) => {
        console.log(result);
        this.imageAIUrl = result;
        this.imageAIReceived = true;
        this.showSpinner = false;
      });
  }
  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

  showFlag: boolean = false;
  selectedImageIndex: number = -1;

  currentIndex: any = -1;

  showLightbox(index) {
    this.currentIndex = index;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }
}
