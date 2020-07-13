import { Component, OnInit } from '@angular/core';
import { RegistrationService } from 'src/app/services/registation/registration.service';

@Component({
  selector: 'app-reg-form-one',
  templateUrl: './reg-form-one.component.html',
  styleUrls: ['./reg-form-one.component.css']
})
export class RegFormOneComponent implements OnInit {

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

}
