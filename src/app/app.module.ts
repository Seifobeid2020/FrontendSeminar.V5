import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/shared/shared.module';
import { AsyncPipe } from '@angular/common';

// Firebase IMPORTS
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { CookieService } from 'ngx-cookie-service';

// Configs IMPORT
import { environment } from 'src/environments/environment';

// Routing IMPORT
import { AppRoutingModule } from './app-routing.module';

// App Components IMPORT
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from 'src/shared/page-not-found/page-not-found.component';

import { HeaderInterceptor } from './shared/header-interceptor.service';

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,

    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [
    CookieService,
    AsyncPipe,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
