// import { OktaAuthService } from '@okta/okta-angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
})
export class PatientComponent implements OnInit {
  // constructor(private authService: OktaAuthService) {}
  constructor() {}

  ngOnInit(): void {}

  // logout() {
  //   this.authService.signOut();
  // }
}
