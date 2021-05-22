import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './components/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'form-primeng';

  userData: any; // Save logged in user data
  idToken: string;

  constructor(
    private authServie: AuthService,
    private afAuth: AngularFireAuth,
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const cookieExists: boolean = this.cookieService.check('__session');
    if (cookieExists) {
      this.idToken = this.cookieService.get('__session');
      this.http
        .get<{ token: string }>(
          'https://us-central1-drradauthpay.cloudfunctions.net/generateCustomToken',
          {
            params: new HttpParams().append('idToken', this.idToken),
          }
        )
        .subscribe((res) => {
          this.afAuth
            .signInWithCustomToken(res.token)
            .then((userCrud) => {
              console.log('User loggen in');
            })
            .catch((err) => {
              window.location.href = 'http://localhost:3000/login.html';
            });
        });
    } else {
      window.location.href = 'http://localhost:3000/login.html';
    }
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user.toJSON();
        this.getCustomClaimRole().then((role) => {
          this.userData = { ...this.userData, role };
          localStorage.setItem('user', JSON.stringify(this.userData));
          this.redirectUser();
        });
      } else {
        localStorage.setItem('user', null);
        console.log(JSON.parse(localStorage.getItem('user')));
      }
    });
    // this.authServie.SignOut();
  }

  async getCustomClaimRole() {
    await firebase.auth().currentUser.getIdToken(true);
    const decodedToken = await firebase.auth().currentUser.getIdTokenResult();
    console.log(decodedToken.claims.stripeRole);
    return decodedToken.claims.stripeRole;
  }

  redirectUser() {
    let user = this.getUser();
    if (user) {
      if (user.role == 'radiologist') {
        this.router.navigate(['radiologist']);
      } else if (user.role == 'dentist') {
        this.router.navigate(['dentist']);
      } else {
        window.location.href = 'http://localhost:3000/login.html';
      }
    } else {
      console.log('User not sigend in');
    }
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    // return  this.afAuth.currentUser.sendEmailVerification().then(() => {
    //   this.router.navigate(['verify-email-address']);
    // });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false ? true : false;
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}
