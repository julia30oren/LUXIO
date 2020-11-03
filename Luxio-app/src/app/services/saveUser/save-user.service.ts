import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from '../user-servise/user.service';
import { RespondService } from '../respond/respond.service';

@Injectable({
  providedIn: 'root'
})
export class SaveUserService {

  // private DB_url: string = 'http://localhost:5000';
  private registeration_URL: string = 'http://localhost:5000/user/registeration';

  private newPas = new BehaviorSubject<string>('');
  public newPas_from_service = this.newPas.asObservable();

  constructor(
    private http: HttpClient,
    private respond_Service: RespondService,
    private user_Service: UserService
  ) { }



  saveUser_toDB(info: object) {
    return this.http.post(`${this.registeration_URL}/save`, info).subscribe(res => {
      if (res[0]) {
        alert(res[0].message);
        if (res[0].state === 1) {
          localStorage.removeItem('my_764528_ct');
          localStorage.removeItem('my_764528_f');
        }
      }
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

  generateNewPass(email: string) {
    return this.http.get(`${this.registeration_URL}/user/${email}`).subscribe(res => {
      // console.log(res)
      if (res === 'ok') {
        // console.log('email with new password has been sent to your email');
        this.newPas.next('ok')
      } else if (res === 'not found') {
        // console.log('user not found')
        this.newPas.next('user not found')

      }
    });
  }

  setNewPassword(info, email) {
    console.log(info, email)
    return this.http.post(`${this.registeration_URL}/user-new-password/${email}`, info).subscribe(res => {
      // console.log(res)
      this.user_Service.seveUser_onService(res);
      // if (res === 'ok') {
      //   // console.log('email with new password has been sent to your email');
      //   this.newPas.next('ok')
      // } else if (res === 'not found') {
      //   // console.log('user not found')
      //   this.newPas.next('user not found')
      // }
    });
  }

}
