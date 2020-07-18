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
    // console.log(imageDetails);
    this.imageDetailList.push(imageDetails);

    // SAVING TO DB ---
    var temp_det = localStorage.getItem('temp_u');
    var user_det = JSON.parse(temp_det);
    user_det.category = imageDetails.category;
    user_det.certificate_link = imageDetails.imageURL;
    this.db_Servise.saveUser_toDB(user_det);
    localStorage.removeItem('temp_u');
  }
}