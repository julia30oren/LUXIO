import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SaveUserService } from '../saveUser/save-user.service';
import { HttpClient } from '@angular/common/http';
import { RespondService } from '../respond/respond.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImgSearviceService {

  private registeration_URL: string = `${environment.hostURL}:${environment.DBport}/registeration`;
  private user_URL: string = `${environment.hostURL}:${environment.DBport}/user`;

  private certifikateLink = new BehaviorSubject<string>('');
  public certifikateLink_fromService = this.certifikateLink.asObservable();

  constructor(
    private http: HttpClient,
    private respond_Service: RespondService,
    private db_Servise: SaveUserService
  ) { }

  insertPhotoDetails(selectedImg, id: string) {
    // ------------------CLOUDINARY ----
    return this.http.post(`${this.registeration_URL}/upload-certificate`, selectedImg)
      .subscribe(res => {
        if (res[0].status && res[0].date) {
          // SAVING link lockaly ---
          let image_link = res[0].date;  //photo link saving to form
          this.saveNewImage_toDB(image_link, id);
        }
        this.respond_Service.saveRespond(res);
      }
      );
  }

  saveNewImage_toDB(img: string, id: string) {
    return this.http.post(`${this.user_URL}/new-image`, { _id: id, photo_link: img })
      .subscribe(res => {
        console.log(res);
        // this.respond_Service.saveRespond(res);
      }
      );
  }

  saveCertifikate(selectedImg) {
    // ------------------CLOUDINARY ----
    return this.http.post(`${this.registeration_URL}/upload-certificate`, selectedImg)
      .subscribe(res => {  // {status, message, date}
        if (res[0].status && res[0].date) {
          // SAVING link lockaly ---
          let image_link = res[0].date;  //photo link saving to form
          this.certifikateLink.next(image_link);
        }
        this.respond_Service.saveRespond(res);
      }
      );
  }

}