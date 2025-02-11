import { Component, OnInit } from '@angular/core';
import { RegistrationService } from './services/registation/registration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public regForm_Open: boolean = false;
  public formOne_Open: boolean = false;
  public formTwo_Open: boolean = false;
  public formAgreement_Open: boolean = false;
  public formLogin_Open: boolean = false;
  public formPasswodRestore_Open: boolean = false;

  formTemplate = new FormGroup({
    name: new FormControl('', Validators.required),
    termsAgree: new FormControl(false, Validators.required)
  });

  constructor(
    private regService: RegistrationService
  ) { }

  ngOnInit() {
    this.regService.regestrationForm_from_service
      .subscribe(data => {
        this.regForm_Open = data;
      });
    this.regService.regestration_formOne_from_service
      .subscribe(data => {
        this.formOne_Open = data;
      });
    this.regService.regestration_formTwo_from_service
      .subscribe(data => {
        this.formTwo_Open = data;
      });
    this.regService.regestration_formAgreement_from_service
      .subscribe(data => {
        this.formAgreement_Open = data;
      });
    this.regService.login_form_from_service
      .subscribe(data => {
        this.formLogin_Open = data;
      });
    this.regService.passwordRestore_form_from_service
      .subscribe(data => {
        this.formPasswodRestore_Open = data;
      });
  }

  openForm() {
    this.registration_form();
  }

  closeForm() {
    this.regService.close_RegistrationForm();
  }

  registration_form() {
    this.regService.open_RegistrationForm();
  }

  login_form() {
    if (this.regForm_Open) {
      this.regService.loginPage();
    } else this.regService.loginForm();

  }

  passwordRest_form() {
    this.regService.passwordRestorePage();
  }

}
