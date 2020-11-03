import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  public languege: string;

  constructor(
    private lang_service: LanguageService,
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => this.languege = date)
  }
}
