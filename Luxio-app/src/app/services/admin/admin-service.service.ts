import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RespondService } from '../respond/respond.service';
import { UserService } from '../user-servise/user.service';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  // public socket = io();

  private admin_URL: string = `${environment.hostURL}:${environment.DBport}/admin`;
  // private orders_URL: string = `${environment.hostURL}:${environment.DBport}/order`;

  private admins = new BehaviorSubject<Array<any>>([]);
  public admins_from_service = this.admins.asObservable();

  constructor(
    private http: HttpClient,
    private respond_Service: RespondService
  ) { }

  getAdmins_fromDB() {
    return this.http.get(`${this.admin_URL}`).subscribe(res => {
      if (res[0].status) {
        this.admins.next(res[0].alladmins);
      } else {
        this.respond_Service.saveRespond(res);
      }
    });
  }

  deleteAdmin_fromDB(id: string, lang: string) {
    return this.http.get(`${this.admin_URL}/${lang}/remove/${id}`).subscribe(res => {
      console.log(res);
    });
  }
}
