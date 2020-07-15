import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from 'src/app/services/registation/registration.service';

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

  public User_agreed: boolean;
  public isSubmitted: boolean;

  constructor(
    private regService: RegistrationService
  ) { }

  ngOnInit() {
  }

  nextPage() {
    this.regService.Page2_RegistrationForm();
  }

  getTermsOfAgeement() {
    this.regService.AgreementPage();
  }

  onSubmit(formValue) {
    console.log('submit 1: ', formValue);
    this.isSubmitted = true;

    if (!formValue.agreement) {
      console.log('false!!!!');
      this.User_agreed = false;
    } else {
      console.log('go!');
      this.User_agreed = true;
    }

  }

  get formControls() {
    return this.formTemplate['controls'];
  }
}
