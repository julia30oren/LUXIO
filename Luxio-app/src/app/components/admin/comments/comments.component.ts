import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-servise/user.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  constructor(
    private user_service: UserService,
    private lang_service: LanguageService
  ) { }

  private languege: string;
  private Comments: Array<any>;

  ngOnInit() {
    this.user_service.getAllComments();

    this.lang_service._selected_from_service
      .subscribe(date => this.languege = date);

    this.user_service.comments_from_service
      .subscribe(date => this.Comments = date)

  }

}
