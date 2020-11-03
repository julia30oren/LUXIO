import { Component, OnInit } from '@angular/core';
import { SaveUserService } from 'src/app/services/saveUser/save-user.service';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user-servise/user.service';

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
  public user_toConsider: Array<any>;
  public status: string;

  constructor(
    private user_Service: UserService,
    private language_Service: LanguageService,
    private registration_Service: SaveUserService
  ) { }

  ngOnInit() {
    this.user_Service.getUsers_fromDB();
    this.user_Service.users_from_service // geting users from db
      .subscribe(date => {
        this.certificatesList = date;
        this.certificates_sorted = date;
      });

    this.language_Service._selected_from_service ///language subscribe
      .subscribe(date => this.language = date)
  }

  // -----------------------------------------SORT------------
  getSort(user_state) {
    this.certificates_sorted = [];
    this.certificatesList.forEach(element => {
      if (element.status === user_state) {
        this.certificates_sorted.push(element)
      }
    });
  }
  // -----------------------------------SORT--------GET ALL-----------------
  getAll() {
    this.certificates_sorted = this.certificatesList;
  }


  // -----------------------------------CHANGE USERS STATUSE----------------------
  // first step step----------------------------
  changeStatus(userId, toDo) {
    this.user_toConsider = [];
    this.status = toDo;
    switch (this.status) {
      case 'confirm':
        this.certificatesList.forEach(element => {
          if (element._id === userId) {
            this.user_toConsider.push(element);
          }
        });
        break;
      case 'deny':
        this.certificatesList.forEach(element => {
          if (element._id === userId) {
            this.user_toConsider.push(element);
          }
        });
        break;
      case 'delete':
        this.certificatesList.forEach(element => {
          if (element._id === userId) {
            this.user_toConsider.push(element);
          }
        });
        break;
      default:
        this.close();
        break;
    }
  }
  // second step to confirm decisions------------
  userStatuse(userId: string, status: string) {
    switch (status) {
      case 'confirm':
        this.registration_Service.sertConfirmation(userId, true, this.language);
        this.close();
        break;
      case 'deny':
        this.registration_Service.sertConfirmation(userId, false, this.language);
        this.close();
        break;
      case 'delete':
        this.registration_Service.deleteUser(userId, this.language);
        window.location.reload()
        this.close();
        break;
      default:
        this.close();
        break;
    }
  }

  close() {
    this.user_toConsider = null;
  }

  openCertificate(link) {
    this.certificateImg = link;
  }

  closeCertificate() {
    this.certificateImg = null;
  }
}
