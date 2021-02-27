import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.css']
})
export class RemoveComponent implements OnInit {
  public languege: string;
  public allAdmins: Array<any>;
  public admin: boolean;
  constructor(
    private router: Router,
    private user_Service: UserService,
    private lang_service: LanguageService,
    private admin_Service: AdminServiceService
  ) { }

  ngOnInit() {
    this.adminCheck();
    // -------------------------------------------subscribing for languege 
    this.lang_service._selected_from_service
      .subscribe(date => this.languege = date);
    // ------------------------------------------subscribing for comments
    this.user_Service.asAdmin_from_service
      .subscribe(date => {
        this.admin = date;
        setTimeout(() => {
          if (this.admin) {
            this.admin_Service.getAdmins_fromDB();
            this.admin_Service.admins_from_service
              .subscribe(date => this.allAdmins = date)
          } else {
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

  deleteAdmin(id) {
    this.admin_Service.deleteAdmin_fromDB(id, this.languege);
  }
}
