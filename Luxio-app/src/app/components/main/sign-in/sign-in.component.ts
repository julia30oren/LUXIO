import { Component, OnInit } from '@angular/core';
import { RegistrationService } from 'src/app/services/registation/registration.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  private langIv: boolean;

  constructor(
    private regService: RegistrationService,
    private lang_service: LanguageService
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => {
        if (date === 'iv') {
          this.langIv = true;
        } else this.langIv = false;
      })
  }

  getID_regForm() {
    this.regService.open_RegistrationForm();
  }

}
