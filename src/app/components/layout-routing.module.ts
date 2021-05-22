import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { pipe } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { customClaims } from '@angular/fire/auth-guard';
import { RedirectToLoginComponent } from './redirect-to-login.component';

const isRadiologist = () =>
  pipe(
    customClaims,
    map((claims) => claims.stripeRole === 'radiologist')
  );
const isDentist = () =>
  pipe(
    customClaims,
    map((claims) => claims.stripeRole === 'dentist')
  );

const redirectLoggedInToItems = () => redirectLoggedInTo(['']);

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,

    children: [
      {
        path: 'radiologist',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: isRadiologist },
        loadChildren: () =>
          import('./radiologist/radiologist.module').then(
            (m) => m.RadiologistModule
          ),
      },
      {
        path: 'dentist',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: isDentist },
        loadChildren: () =>
          import('./dentist/dentist.module').then((m) => m.DentistModule),
      },
    ],
  },
  {
    path: 'login',
    component: RedirectToLoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToItems },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
