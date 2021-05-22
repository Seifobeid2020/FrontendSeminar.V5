import { Subject, Subscription } from 'rxjs';
import { MessagePatientService } from 'src/app/components/dentist/message-patient/message-patient.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MenuItem } from 'primeng/api';
import { PatientDashboard } from '../../radiologist/shared/models/patient-dashboard.model';
import { AuthService } from '../../auth.service';

interface radiologistViewModel {
  name;
  phoneNumber;
  totalPatients?;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // userId;
  sub: Subscription;
  topFiveRad: radiologistViewModel[] = [];
  totalPatients;

  userDataAuth: any;
  totalRadiologists = new Set();
  test = new Set<string>();
  RadiologistsMap: Map<any, number> = new Map<any, number>();
  RadiologistsMapDetails: Map<any, radiologistViewModel> = new Map<
    any,
    radiologistViewModel
  >();
  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private authService: AuthService
  ) {}
  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

  ngOnInit() {
    this.images = [
      {
        previewImageSrc: '/assets/images/Ad1.png',
        thumbnailImageSrc: '/assets/images/Ad1.png',
        alt: 'Description for Image 1',
        title: 'Title 1',
      },

      {
        previewImageSrc: '/assets/test_2.png',
        thumbnailImageSrc: '/assets/test_2.png',
        alt: 'Description for Image 2',
        title: 'Title 2',
      },
    ];

    this.userDataAuth = this.authService.getUser();
    this.totalPatients = 0;
    this.afs
      .collection('messages', (ref) =>
        ref.where('receiverId', '==', this.userDataAuth.uid)
      )
      .get()
      .subscribe((data) => {
        data.forEach((d: any) => {
          this.totalPatients++;
          this.totalRadiologists.add(d.data().senderId);
          this.RadiologistsMapDetails.set(d.data().senderId, {
            name: d.data().senderName,
            phoneNumber: d.data().senderPhoneNumber,
          });
          var tempNumberPatients = 0;
          this.RadiologistsMap.forEach((value: number, key: string) => {
            if (key == d.data().senderId) {
              tempNumberPatients = value;
            }
          });
          this.RadiologistsMap.set(d.data().senderId, ++tempNumberPatients);
        });
        const mapSort1 = new Map(
          [...this.RadiologistsMap.entries()].sort((a, b) => b[1] - a[1])
        );

        if (this.totalRadiologists.size < 5) {
          for (var i = 0; i < this.totalRadiologists.size; i++) {
            var tempRadDetails = this.RadiologistsMapDetails.get(
              Array.from(mapSort1)[i][0]
            );

            this.topFiveRad.push({
              name: tempRadDetails.name,
              phoneNumber: tempRadDetails.phoneNumber,
              totalPatients: Array.from(mapSort1)[i][1],
            });
          }
        } else {
          for (var i = 0; i < 5; i++) {
            var tempRadDetails = this.RadiologistsMapDetails.get(
              Array.from(mapSort1)[i][0]
            );

            this.topFiveRad.push({
              name: tempRadDetails.name,
              phoneNumber: tempRadDetails.phoneNumber,
              totalPatients: Array.from(mapSort1)[i][1],
            });
          }
        }
      });
    // this.topFiveRad
  }

  images: any[];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
}
