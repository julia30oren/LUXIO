import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { CrtificatesListComponent } from './components/certificates/crtificates-list/crtificates-list.component';
import { CrtificateUploadComponent } from './components/certificates/crtificate-upload/crtificate-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    CrtificatesListComponent,
    CrtificateUploadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
