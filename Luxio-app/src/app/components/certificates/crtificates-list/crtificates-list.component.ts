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

  public language: string;
  public certificateImg: string;
  public user_toDelete: Array<any>;
  public user_toConfirm: Array<any>;
  public user_toDeny: Array<any>

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
      .subscribe(date => this.language = date)

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

  confirm(user_id) {
    this.user_toConfirm = [];
    this.certificatesList.forEach(element => {
      if (element._id === user_id) {
        this.user_toConfirm.push(element);
      }
    });
    // this.getUsersService.sertConfirmation(user_id, setState);
  }
  confirmState(st: boolean) {
    if (st) {
      this.getUsersService.sertConfirmation(this.user_toConfirm[0]._id, st);
      this.user_toConfirm = null;
    } else this.user_toConfirm = null;
  }

  deny(user_id) {
    this.user_toDeny = [];
    this.certificatesList.forEach(element => {
      if (element._id === user_id) {
        this.user_toDeny.push(element);
      }
    });
  }

  denyState(st: boolean) {
    if (st) {
      this.getUsersService.sertConfirmation(this.user_toDeny[0]._id, !st);
      this.user_toDeny = null;
    } else this.user_toDeny = null;
  }

  delete(user_id) {
    this.user_toDelete = [];
    this.certificatesList.forEach(element => {
      if (element._id === user_id) {
        this.user_toDelete.push(element);
      }
    });
  }

  deleteState(st: boolean) {
    if (st) {
      this.getUsersService.deleteUser(this.user_toDelete[0]._id);
      this.user_toDelete = null;
    } else this.user_toDelete = null;
  }

  openCertificate(link) {
    this.certificateImg = link;
  }

  closeCertificate() {
    this.certificateImg = null;
  }

}
