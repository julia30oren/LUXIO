import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  public languege: string;

  constructor(
    private language_Service: LanguageService
  ) { }

  ngOnInit() {
    this.language_Service._selected_from_service
      .subscribe(date => this.languege = date);
  }

}
