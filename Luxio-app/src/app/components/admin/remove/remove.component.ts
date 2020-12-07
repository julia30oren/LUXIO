import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.css']
})
export class RemoveComponent implements OnInit {
  public languege: string;
  public allAdmins: Array<any>;

  constructor(
    private lang_service: LanguageService,
    private admin_Service: AdminServiceService
  ) { }

  ngOnInit() {
    // -------------------------------------------subscribing for languege 
    this.lang_service._selected_from_service
      .subscribe(date => this.languege = date);
    // ------------------------------------------subscribing for comments
    this.admin_Service.getAdmins_fromDB();
    this.admin_Service.admins_from_service
      .subscribe(date => this.allAdmins = date)
  }

  deleteAdmin(id) {
    console.log(id);
    // this.admin_Service.deleteAdmin_fromDB(id, this.languege);
  }
}
