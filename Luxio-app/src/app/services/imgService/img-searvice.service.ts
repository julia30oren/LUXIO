import { Injectable } from '@angular/core';
import { SaveUserService } from '../saveUser/save-user.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ImageService {
  public cloudinary_responce: Array<any> = [];

  constructor(
    private http: HttpClient,
    private db_Servise: SaveUserService
  ) { }



  insertImageDetails(imageDetails, formValue) {
    console.log(imageDetails);
    var temp_det = localStorage.getItem('temp_u');
    var user_det = JSON.parse(temp_det);
    user_det.category = formValue.category;
    console.log(imageDetails, user_det);

    // CLOUDINARY ----
    return this.http.post('http://localhost:5000/register/upload-images',
      imageDetails)
      .subscribe(res => {
        this.cloudinary_responce.push(res);
        if (this.cloudinary_responce[0]) {
          alert(this.cloudinary_responce[0].message);
          // SAVING TO DB ---
          user_det.certificate_link = this.cloudinary_responce[0].date;
          this.db_Servise.saveUser_toDB(user_det);
          localStorage.removeItem('temp_u');
        }
      }
      );



  }
}