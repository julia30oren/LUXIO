import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(
    private lang_service: LanguageService,
    private user_service: UserService
  ) { }

  public languege: string;
  public message_to_user: string;


  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => this.languege = date);

    this.user_service.message_to_user_from_service
      .subscribe(date => {
        this.message_to_user = date;

      })
  }

  closeMessage() {
    window.setTimeout(() => {
      this.user_service.cleanMessage_toUser();
    }, 1500)
  }

}
