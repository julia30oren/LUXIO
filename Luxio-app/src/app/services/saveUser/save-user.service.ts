import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from '../user-servise/user.service';
import { RespondService } from '../respond/respond.service';
import { RegistrationService } from '../registation/registration.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaveUserService {
  private DB_url: string = `${environment.hostURL}:${environment.DBport}/user`;
  private registeration_URL: string = `${environment.hostURL}:${environment.DBport}/user/registeration`;

  private stateForm = new BehaviorSubject<boolean>(false);
  public stateForm_from_service = this.stateForm.asObservable();

  constructor(
    private http: HttpClient,
    private respond_Service: RespondService,
    private register_Service: RegistrationService,
    private user_Service: UserService
  ) { }



  saveUser_toDB(info: object, language: string) {
    return this.http.post(`${this.registeration_URL}/${language}/save`, info).subscribe(res => {
      this.respond_Service.saveRespond(res);
      if (res[0].statuse) {
        localStorage.removeItem('my_764528_ct');
        localStorage.removeItem('my_764528_f');
      }
    });
  }

  saveUserPhoto(info: object) {
    return this.http.post(`${this.DB_url}/new-image`, info).subscribe(res => {
      this.respond_Service.saveRespond(res);
    });
  }

  sertConfirmation(id: string, state: boolean, language: string) {
    return this.http.get(`${this.registeration_URL}/${language}/status/${id}/${state}`).subscribe(res => {
      this.respond_Service.saveRespond(res);
      this.user_Service.getUsers_fromDB();
    });
  }

  deleteUser(id: string, language: string) {
    return this.http.get(`${this.registeration_URL}/${language}/delete/user/${id}`).subscribe(res => {
      console.log(res);
      this.respond_Service.saveRespond(res);
      this.user_Service.getUsers_fromDB();
    });
  }

  generateNewPass(email: string, language: string) {
    return this.http.get(`${this.registeration_URL}/${language}/password/restore/${email}`).subscribe(res => {
      this.respond_Service.saveRespond(res);
      if (res[0].status) {
        this.stateForm.next(true);
      }
    });
  }

  setNewPassword(info, email: string, language: string) {
    return this.http.post(`${this.registeration_URL}/${language}/password/restore/new/${email}`, info).subscribe(res => {
      this.respond_Service.saveRespond(res);
      console.log(res);
      if (res[0].status) {
        this.register_Service.close_RegistrationForm();
      }

    });
  }

}
