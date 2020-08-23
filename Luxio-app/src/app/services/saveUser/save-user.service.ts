import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveUserService {

  private DB_url: string = 'http://localhost:5000';

  private users = new BehaviorSubject<Array<any>>([]);
  public users_from_service = this.users.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getUsers_fromDB() {
    return this.http.get(`${this.DB_url}/register/users`).subscribe(res => this.users.next([res]));
  }

  saveUser_toDB(info: object) {
    return this.http.post(`${this.DB_url}/register/saveNew`, info).subscribe(res => console.log(res));
  }

  sertConfirmation(id, state) {
    console.log(id, state);
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
}
