import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User_Interface } from '../../interfaces/user-interface';

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

  sertConfirmation(user: object) {
    return this.http.post(`${this.DB_url}/register/userST`, user).subscribe(res => console.log(res));
  }
}
