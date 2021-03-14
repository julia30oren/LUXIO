import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-mailings',
  templateUrl: './mailings.component.html',
  styleUrls: ['./mailings.component.css']
})
export class MailingsComponent implements OnInit {

  constructor(
    private router: Router,
    private user_Service: UserService,
    private language_Service: LanguageService,
  ) { }
  public language: string;
  public admin: boolean

  ngOnInit() {
    this.adminCheck();

    this.language_Service._selected_from_service ///language subscribe
      .subscribe(date => this.language = date);

    this.user_Service.asAdmin_from_service
      .subscribe(date => {
        this.admin = date;
        setTimeout(() => {
          if (!this.admin) {
            this.router.navigate(['/**']);
          }
        }, 1000);
      });
  }

  adminCheck() {
    let adminToken = localStorage.getItem('token');
    if (adminToken) {
      this.user_Service.adminTokenCheck(adminToken);
    } else this.router.navigate(['/**']);
  }

}
