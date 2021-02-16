import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { RegFormOneComponent } from './components/registration/reg-form-one/reg-form-one.component';
import { LogFormComponent } from './components/registration/log-form/log-form.component';
import { PasswordRestoreFormComponent } from './components/registration/password-restore-form/password-restore-form.component';
import { FooterComponent } from './components/main/footer/footer.component';
import { BigImageComponent } from './components/elements/big-image/big-image.component';
import { ShopCardsComponent } from './components/elements/shop-cards/shop-cards.component';
import { WideCardsComponent } from './components/elements/wide-cards/wide-cards.component';
import { PersonalAreaComponent } from './components/personal-area/personal-area.component';
import { PersonalACardComponent } from './components/elements/personal-a-card/personal-a-card.component';
import { CommentsComponent } from './components/admin/comments/comments.component';
import { CookiesComponent } from './components/cookies/cookies.component';
import { PrivateInfoComponent } from './components/elements/private-info/private-info.component';
import { PurchaseHistoryComponent } from './components/elements/purchase-history/purchase-history.component';
import { CommentFormComponent } from './components/elements/comment-form/comment-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistrationComponent } from './components/admin/registration/registration.component';
import { RemoveComponent } from './components/admin/remove/remove.component';
import { HomeComponent } from './components/main/home/home.component';
import { OrdersComponent } from './components/admin/orders/orders.component';
import { TrymeComponent } from './components/main/tryme/tryme.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    RegFormOneComponent,
    LogFormComponent,
    PasswordRestoreFormComponent,
    routingComponents,
    FooterComponent,
    BigImageComponent,
    ShopCardsComponent,
    WideCardsComponent,
    PersonalAreaComponent,
    PersonalACardComponent,
    CommentsComponent,
    CookiesComponent,
    PrivateInfoComponent,
    PurchaseHistoryComponent,
    CommentFormComponent,
    RegistrationComponent,
    RemoveComponent,
    HomeComponent,
    OrdersComponent,
    TrymeComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFireStorageModule,
    // AngularFireDatabaseModule,
    ReactiveFormsModule,

    IonicStorageModule.forRoot(),

    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
