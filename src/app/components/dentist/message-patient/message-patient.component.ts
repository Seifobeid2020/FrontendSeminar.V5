import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MessagePatientService } from './message-patient.service';

@Component({
  selector: 'app-patient',
  templateUrl: './message-patient.component.html',
  styleUrls: ['./message-patient.component.css'],
})
export class MessagePatientComponent implements OnInit {
  messagesArray = [];
  constructor() {}

  ngOnInit(): void {}
}
