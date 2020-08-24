import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicStorageModule } from '@ionic/storage';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';

import { RegFormOneComponent } from './components/registration/reg-form-one/reg-form-one.component';
import { RegFormTwoComponent } from './components/registration/reg-form-two/reg-form-two.component';
import { RegFormAgreementComponent } from './components/registration/reg-form-agreement/reg-form-agreement.component';
import { LogFormComponent } from './components/registration/log-form/log-form.component';
import { PasswordRestoreFormComponent } from './components/registration/password-restore-form/password-restore-form.component';
import { NewComponent } from './components/main/new/new/new.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    RegFormOneComponent,
    RegFormTwoComponent,
    RegFormAgreementComponent,
    LogFormComponent,
    PasswordRestoreFormComponent,
    routingComponents,
    NewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,

    IonicStorageModule.forRoot(),

    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
