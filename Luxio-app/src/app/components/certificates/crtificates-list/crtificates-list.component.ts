import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/imgService/img-searvice.service';
import { SaveUserService } from 'src/app/services/saveUser/save-user.service';

@Component({
  selector: 'app-crtificates-list',
  templateUrl: './crtificates-list.component.html',
  styleUrls: ['./crtificates-list.component.css']
})
export class CrtificatesListComponent implements OnInit {

  certificatesList: any[];
  // rowIndexArray: any[];

  constructor(
    private cert_service: ImageService,
    private getUsersService: SaveUserService
  ) { }

  ngOnInit() {
    this.getUsersService.getUsers_fromDB();
    this.getUsersService.users_from_service
      .subscribe(date => this.certificatesList = date[0]);
    // this.getDate();
  }

  confirm(user_id) {
    let user = {
      id: user_id,
      status: 1
    };
    this.getUsersService.sertConfirmation(user);
  }

  refuse(user_id) {
    let user = {
      id: user_id,
      status: 2
    };
    this.getUsersService.sertConfirmation(user);
  }

  // getDate() {
  //   this.cert_service.imageDetailList
  //     .snapshotChanges()
  //     .subscribe(list => {
  //       // this.certificatesList = list
  //       this.certificatesList = list.map(item => { console.log(item); return item.payload.val(); });
  //       // this.rowIndexArray = Array.from(Array(Math.ceil(this.certificatesList.length / 3)).keys())
  //     })
  // }
}
