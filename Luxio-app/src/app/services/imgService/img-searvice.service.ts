import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { SaveUserService } from '../saveUser/save-user.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  imageDetailList: AngularFireList<any>;

  constructor(
    private firebase: AngularFireDatabase,
    private db_Servise: SaveUserService
  ) { }

  getImageDetailList() {
    this.imageDetailList = this.firebase.list('imageDetails');
  }

  insertImageDetails(imageDetails) {
    // SAVING TO FIREBASE ---
    this.imageDetailList.push(imageDetails);

    // SAVING TO DB ---
    var temp_det = localStorage.getItem('temp_u');
    var user_det = JSON.parse(temp_det);
    var temp_det2 = localStorage.getItem('temp_u2');
    var user_det2 = JSON.parse(temp_det2);
    // console.log(user_det2.category, user_det2.imageURL);
    user_det.category = user_det2.category;
    user_det.certificate_link = user_det2.imageURL;
    // console.log(user_det);
    this.db_Servise.saveUser_toDB(user_det);
  }
}