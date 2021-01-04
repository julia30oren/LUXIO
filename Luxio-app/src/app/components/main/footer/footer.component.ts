import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { RegistrationService } from 'src/app/services/registation/registration.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public languege: string;
  private admin: boolean = false;

  constructor(
    private language_Service: LanguageService,
    private regestration_Service: RegistrationService
  ) { }

  ngOnInit() {
    this.language_Service._selected_from_service
      .subscribe(date => { this.languege = date });
    // if user is admin
    this.regestration_Service.admin_from_service
      .subscribe(date => this.admin = date);
  }

}
