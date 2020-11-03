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

  public languege: string;
  public comments: Array<any>;

  ngOnInit() {
    // -------------------------------------------subscribing for languege 
    this.lang_service._selected_from_service
      .subscribe(date => this.languege = date);
    // ------------------------------------------subscribing for comments
    this.user_service.getAllComments();
    this.user_service.comments_from_service
      .subscribe(date => this.comments = date)
  }

  // need a function to delete comments by ID

}
