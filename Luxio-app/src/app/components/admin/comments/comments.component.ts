import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-servise/user.service';
import { LanguageService } from 'src/app/services/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  constructor(
    private router: Router,
    private user_service: UserService,
    private lang_service: LanguageService
  ) { }

  public languege: string;
  public comments: Array<any>;
  public admin: boolean;

  ngOnInit() {
    this.adminCheck();
    // -------------------------------------------subscribing for languege 
    this.lang_service._selected_from_service
      .subscribe(date => this.languege = date);
    // ------------------------------------------subscribing for comments
    this.user_service.asAdmin_from_service
      .subscribe(date => {
        this.admin = date;
        setTimeout(() => {
          if (this.admin) {
            this.user_service.getAllComments();
            this.user_service.comments_from_service
              .subscribe(date => this.comments = date[0]);
          } else {
            this.router.navigate(['/**']);
          }
        }, 1000);
      });

  }

  adminCheck() {
    let adminToken = localStorage.getItem('token');
    if (adminToken) {
      this.user_service.adminTokenCheck(adminToken);
    } else this.router.navigate(['/**']);
  }

  // need a function to delete comments by ID

}
