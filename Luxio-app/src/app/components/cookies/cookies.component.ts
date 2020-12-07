import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { RespondService } from 'src/app/services/respond/respond.service';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css']
})
export class CookiesComponent implements OnInit {

  constructor(
    private respond_Service: RespondService,
    private lang_service: LanguageService
  ) { }

  public languege: string;


  ngOnInit() {
    // -------------------------------------------subscribing for languege 
    this.lang_service._selected_from_service
      .subscribe(date => this.languege = date);
  }

  agreeOrNot(st: boolean) {
    this.respond_Service.agreementToCookiesPolicy(st);
  }

}
