import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
// import { CheckboxModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md';
// import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { CrtificatesListComponent } from './components/certificates/crtificates-list/crtificates-list.component';
import { CrtificateUploadComponent } from './components/certificates/crtificate-upload/crtificate-upload.component';
import { HomeComponent } from './components/main/home/home.component';
import { ShopComponent } from './components/main/shop/shop.component';
import { CoursesComponent } from './components/main/courses/courses.component';
import { ContactsComponent } from './components/main/contacts/contacts.component';
import { SignInComponent } from './components/main/sign-in/sign-in.component';
import { PageNotFoundComponent } from './components/main/page-not-found/page-not-found.component';
import { RegFormOneComponent } from './components/registration/reg-form-one/reg-form-one.component';
import { RegFormTwoComponent } from './components/registration/reg-form-two/reg-form-two.component';
import { RegFormAgreementComponent } from './components/registration/reg-form-agreement/reg-form-agreement.component';
import { LogFormComponent } from './components/registration/log-form/log-form.component';
import { PasswordRestoreFormComponent } from './components/registration/password-restore-form/password-restore-form.component';

@NgModule({
  declarations: [
    AppComponent,
    CrtificatesListComponent,
    CrtificateUploadComponent,
    HomeComponent,
    ShopComponent,
    CoursesComponent,
    ContactsComponent,
    SignInComponent,
    PageNotFoundComponent,
    RegFormOneComponent,
    RegFormTwoComponent,
    RegFormAgreementComponent,
    LogFormComponent,
    PasswordRestoreFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    // MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  // schemas: [NO_ERRORS_SCHEMA]

})
export class AppModule { }
