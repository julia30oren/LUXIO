import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from '../user-servise/user.service';

@Injectable({
  providedIn: 'root'
})
export class SaveUserService {

  private DB_url: string = 'http://localhost:5000';

  private users = new BehaviorSubject<Array<any>>([]);
  public users_from_service = this.users.asObservable();

  private newPas = new BehaviorSubject<string>('');
  public newPas_from_service = this.newPas.asObservable();

  constructor(
    private http: HttpClient,
    private user_service: UserService
  ) { }

  getUsers_fromDB() {
    return this.http.get(`${this.DB_url}/register/users`).subscribe(res => this.users.next([res]));
  }

  saveUser_toDB(info: object) {
    return this.http.post(`${this.DB_url}/register/saveNew`, info).subscribe(res => {
      if (res[0]) {
        alert(res[0].message);
        if (res[0].state === 1) {
          localStorage.removeItem('my_764528_ct');
          localStorage.removeItem('my_764528_f');
        }
      }

    });
  }

  sertConfirmation(id, state) {
    // console.log(id, state);
    return this.http.get(`${this.DB_url}/register/user-status/${id}/${state}`).subscribe(res => {
      console.log(res);
      if (res[0].nModified === 1) {
        let newUsers = this.users.value[0];
        newUsers.forEach(element => {
          if (element._id === id) {
            element.status = `${state}`;
          }
        });
      }
    });
  }

  deleteUser(user_id) {
    return this.http.get(`${this.DB_url}/register/remove-user/${user_id}`).subscribe(res => { console.log(res); this.getUsers_fromDB(); });
  }

  generateNewPass(email: string) {
    return this.http.get(`${this.DB_url}/register/user/${email}`).subscribe(res => {
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
    return this.http.post(`${this.DB_url}/register/user-new-password/${email}`, info).subscribe(res => {
      // console.log(res)
      this.user_service.seveUser_onService(res);
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
