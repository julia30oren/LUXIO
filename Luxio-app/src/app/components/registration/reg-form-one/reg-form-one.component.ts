import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from 'src/app/services/registation/registration.service';
import { UUID } from 'angular2-uuid';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-reg-form-one',
  templateUrl: './reg-form-one.component.html',
  styleUrls: ['./reg-form-one.component.css']
})
export class RegFormOneComponent implements OnInit {

  public formTemplate = new FormGroup({
    first_name: new FormControl('', Validators.required),
    second_name: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phoneN: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    agreement: new FormControl(false, Validators.required)
  })

  public password1: string = '';
  public password2: boolean;
  public User_agreed: boolean;
  public isSubmitted: boolean;

  constructor(
    private regService: RegistrationService
  ) { }

  ngOnInit() {
    this.regService.conditions_of_use_from_service
      .subscribe(date => this.User_agreed = date);
  }

  nextPage() {
    this.regService.Page2_RegistrationForm();
  }

  getTermsOfAgeement() {
    this.regService.AgreementPage();
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      if (this.User_agreed) {
        formValue.id = UUID.UUID();
        // console.log('can go', formValue);
        localStorage.setItem('temp_u', JSON.stringify(formValue));
        this.nextPage();
      } else {
        this.User_agreed = false;
      }
    } else {
      console.log('denied');
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  password1_change(pas1) {
    this.password1 = pas1;
  }

  password2_change(pas2) {
    if (this.password1 === pas2) {
      this.password2 = true;
    } else this.password2 = false;
  }

  terms_check(val) {
    console.log(val);
    this.regService.user_agree_with_terms(val);
  }
}