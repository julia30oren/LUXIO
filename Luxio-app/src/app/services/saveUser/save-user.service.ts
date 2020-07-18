import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User_Interface } from '../../interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class SaveUserService {

  private DB_url: string = 'http://localhost:5000';

  constructor(
    private http: HttpClient
  ) { }

  getUsers_fromDB(): Observable<User_Interface[]> {
    const users_result = this.http.get<User_Interface[]>(`${this.DB_url}/users`);
    console.log(users_result);
    return users_result;
  }

  saveUser_toDB(info: object) {
    console.log(info);

    // NOT WORKING   !!!   WHY????
    const save_result = this.http.post(`http://localhost:5000/register/save-new`, info);
    return save_result;
  }
}
