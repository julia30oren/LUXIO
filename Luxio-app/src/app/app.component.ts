import { Component, OnInit } from '@angular/core';
import { RegistrationService } from './services/registation/registration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { Router } from "@angular/router";
import { LanguageService } from './services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './services/user-servise/user.service';
import { ShopService } from './services/shop/shop.service';
import { RespondService } from './services/respond/respond.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public regForm_Open: boolean = false;
  public formOne_Open: boolean = false;
  public formAgreement_Open: boolean = false;
  public formLogin_Open: boolean = false;
  public formPasswodRestore_Open: boolean = false;
  public languege: string;
  public user: string;
  public cookies: boolean;
  public advertisement: boolean;
  public respond: Array<any> = [];
  public selectedProd: boolean;

  formTemplate = new FormGroup({
    name: new FormControl('', Validators.required),
    termsAgree: new FormControl(false, Validators.required)
  });

  constructor(
    private respond_Service: RespondService,
    private language_Service: LanguageService,
    private regestration_Service: RegistrationService,
    private shop_Service: ShopService,
    private user_Service: UserService
  ) { }

  ngOnInit() {
    // --------checking cookies agreement--------
    this.respond_Service.agreementCheck();
    this.respond_Service.userAgreementPolicy_service
      .subscribe(date => {
        this.cookies = date;
      });
    // ------------------------------timer for advertisement (after 30 sec.)-----
    window.setTimeout(() => {
      if (!this.user && !this.regForm_Open) {
        this.advertisement = true;
      }
    }, 30000);
    // ----------------------------------------language setings----
    this.language_Service._selected_from_service//subscribing for languege
      .subscribe(date => this.languege = date);
    // ----------------------if user loged in-------
    this.user_Service.user_name_from_service
      .subscribe(date => {
        this.user = date;
      });
    // -------------------------------------------------------------------------------------
    this.respond_Service.respond_fromServer_service
      .subscribe(date => {
        this.respond = date; // [ { "status": true, "message": "Спасибо за ваш комментарий." } ]
        window.setTimeout(() => {
          this.respond = [];
        }, 5000);
      })
    // -------------------------------------------REGISTRATION SETINGS-----------
    this.regestration_Service.regestrationForm_from_service
      .subscribe(data => {
        this.regForm_Open = data;
      });
    this.regestration_Service.regestration_formOne_from_service
      .subscribe(data => {
        this.formOne_Open = data;
      });
    this.regestration_Service.regestration_formAgreement_from_service
      .subscribe(data => {
        this.formAgreement_Open = data;
      });
    this.regestration_Service.login_form_from_service
      .subscribe(data => {
        this.formLogin_Open = data;
      });
    this.regestration_Service.passwordRestore_form_from_service
      .subscribe(data => {
        this.formPasswodRestore_Open = data;
      });
    // ----------------------//selecting one prodoct to be opend---------------
    this.shop_Service.select_one_from_service
      .subscribe(date => this.selectedProd = date);
  }

  registration_form() {
    this.regestration_Service.open_RegistrationForm();
  }

  login_form() {
    this.regestration_Service.loginForm();
  }

  closeForm() {
    this.regestration_Service.close_RegistrationForm();
    this.user_Service.denyAdminEntrance();
  }

  passwordRest_form() {
    this.regestration_Service.passwordRestorePage();
  }

  agreeToCookiesPolicy() {
    this.respond_Service.agreementToCookiesPolicy(true);
  }

  close_advertisement() {
    this.advertisement = false;
  }
}