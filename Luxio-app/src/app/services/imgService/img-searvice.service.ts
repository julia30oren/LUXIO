import { Injectable } from '@angular/core';
import { SaveUserService } from '../saveUser/save-user.service';
import { HttpClient } from '@angular/common/http';
import { LocationStrategy } from '@angular/common';


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
    // console.log('imageDetails : ', imageDetails, 'formValue : ', formValue);

    // CLOUDINARY ----
    return this.http.post('http://localhost:5000/register/upload-images',
      imageDetails)
      .subscribe(res => {
        // console.log(res)
        this.cloudinary_responce.push(res);
        if (this.cloudinary_responce[0]) {
          // SAVING TO DB ---
          formValue.certificate_link = this.cloudinary_responce[0].date;
          // console.log(formValue);
          this.db_Servise.saveUser_toDB(formValue);
        }
      }
      );



  }
}