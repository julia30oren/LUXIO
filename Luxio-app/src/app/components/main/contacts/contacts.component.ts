import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  private langIv: boolean;

  constructor(
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

}
