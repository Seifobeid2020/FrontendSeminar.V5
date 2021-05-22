import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  idToken: string;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    private cookieService: CookieService,
    private http: HttpClient
  ) {}

  init() {}

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

  // Sign out
  SignOut() {
    this.afAuth
      .signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.cookieService.delete('__session');
        window.location.href = 'http://localhost:3000/login.html';
      })
      .catch((error) => console.log(error.message));
  }

  async getCustomClaimRole() {
    await firebase.auth().currentUser.getIdToken(true);
    const decodedToken = await firebase.auth().currentUser.getIdTokenResult();
    console.log(decodedToken.claims.stripeRole);
    return decodedToken.claims.stripeRole;
  }
}
