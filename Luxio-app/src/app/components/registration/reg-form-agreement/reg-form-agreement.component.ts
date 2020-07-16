import { Component, OnInit } from '@angular/core';
import { RegistrationService } from 'src/app/services/registation/registration.service';

@Component({
  selector: 'app-reg-form-agreement',
  templateUrl: './reg-form-agreement.component.html',
  styleUrls: ['./reg-form-agreement.component.css']
})
export class RegFormAgreementComponent implements OnInit {

  constructor(
    private regSevice: RegistrationService
  ) { }

  ngOnInit() {
  }

  agree() {
    this.regSevice.user_agree_with_terms(true);
  }

  disagree() {
    this.regSevice.close_AgreementPage();
  }
}
