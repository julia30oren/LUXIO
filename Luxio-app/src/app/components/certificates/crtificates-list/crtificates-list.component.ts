import { Component, OnInit } from '@angular/core';
import { SaveUserService } from 'src/app/services/saveUser/save-user.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-crtificates-list',
  templateUrl: './crtificates-list.component.html',
  styleUrls: ['./crtificates-list.component.css']
})
export class CrtificatesListComponent implements OnInit {

  public certificatesList: Array<any>;
  public certificates_sorted: Array<any>;

  public langIv: boolean = false;
  public certificateImg: string;

  constructor(
    private getUsersService: SaveUserService,
    private lang_service: LanguageService
  ) { }

  ngOnInit() {
    this.getUsersService.getUsers_fromDB();
    this.getUsersService.users_from_service
      .subscribe(date => {
        this.certificatesList = date[0];
        this.certificates_sorted = date[0];
      });

    this.lang_service._selected_from_service
      .subscribe(date => {
        if (date === 'iv') {
          this.langIv = true;
        } else this.langIv = false;
        // console.log(date)
      })


  }

  getSort(user_state) {
    this.certificates_sorted = [];
    this.certificatesList.forEach(element => {
      if (element.status === user_state) {
        this.certificates_sorted.push(element)
      }
    });
  }

  getAll() {
    this.certificates_sorted = this.certificatesList;
  }

  confirm(user_id, setState) {
    this.getUsersService.sertConfirmation(user_id, setState);
  }

  delete(user_id) {
    console.log(user_id)
  }

  openCertificate(link) {
    this.certificateImg = link;
  }

  closeCertificate() {
    this.certificateImg = null;
  }

}
