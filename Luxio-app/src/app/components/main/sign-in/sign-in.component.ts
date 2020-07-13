import { Component, OnInit } from '@angular/core';
import { RegistrationService } from 'src/app/services/registation/registration.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  // public applyForId: boolean = false;

  constructor(
    private regService: RegistrationService
  ) { }

  ngOnInit() {
  }

  getID_regForm() {
    this.regService.open_RegistrationForm();
  }

}
