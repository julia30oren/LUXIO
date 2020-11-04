import { Injectable } from '@angular/core';
import { SaveUserService } from '../saveUser/save-user.service';
import { HttpClient } from '@angular/common/http';
import { LocationStrategy } from '@angular/common';
import { RespondService } from '../respond/respond.service';


@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private registeration_URL: string = 'http://localhost:5000/user/registeration'

  constructor(
    private http: HttpClient,
    private respond_Service: RespondService,
    private db_Servise: SaveUserService
  ) { }

  insertImageDetails(imageDetails, formValue, languege) {
    // console.log('imageDetails : ', imageDetails, 'formValue : ', formValue);
    // ------------------CLOUDINARY ----
    return this.http.post(`${this.registeration_URL}/upload-certificate`, imageDetails)
      .subscribe(res => {
        this.respond_Service.saveRespond(res);
        // SAVING TO DB ---
        formValue.certificate_link = res[0].date;  //certificate link saving to form
        console.log(formValue.certificate_link);
        this.db_Servise.saveUser_toDB(formValue, languege);
      }
      );
  }
}