import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-radiologist',
  templateUrl: './radiologist.component.html',
  styleUrls: ['./radiologist.component.css'],
})
export class RadiologistComponent implements OnInit {
  itemsNav: MenuItem[];
  itemsSideNav: MenuItem[];

  userData: any;
  showAccountSettings: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userData = this.authService.getUser();

    console.log(this.userData);
    this.itemsSideNav = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/radiologist'],
        routerLinkActiveOptions: { exact: true },
      },

      {
        label: 'Patients',
        icon: 'pi pi-fw pi-user',
        routerLink: ['/radiologist/patients'],
      },

      {
        label: 'Expenses',
        icon: 'pi pi-dollar',
        routerLink: ['/radiologist/expenses'],
      },
      {
        label: 'Reports',
        icon: 'pi pi-chart-line',
        routerLink: ['/radiologist/reports'],
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',

        items: [
          {
            label: ' Treatment Type',
            icon: 'pi pi-plus',
            routerLink: ['/radiologist/treatment-type'],
            routerLinkActiveOptions: { exact: true },
          },
          {
            label: ' Expense Type',
            icon: 'pi pi-plus',
            routerLink: ['/radiologist/expense-type'],
            routerLinkActiveOptions: { exact: true },
          },
        ],
      },
    ];
  }

  logout() {
    this.authService.SignOut();
  }

  onClickedOutside(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;

    if (idAttr != null) {
      if (idAttr.value == 'accountSettings') {
        return;
      }
    }

    this.showAccountSettings = false;
  }
  onClickUserProfile() {
    this.showAccountSettings = !this.showAccountSettings;
  }
  async onClickUserAccount() {
    const functionRef = firebase
      .app()
      .functions('us-central1')
      .httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
    const { data } = await functionRef({ returnUrl: window.location.origin });
    window.location.assign(data.url);
  }
}
