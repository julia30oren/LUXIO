import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RespondService } from '../respond/respond.service';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private admin_URL: string = 'http://localhost:5000/admin';

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
      } else this.respond_Service.saveRespond(res);
    });
  }

  deleteAdmin_fromDB(id: string, lang: string) {
    return this.http.get(`${this.admin_URL}/${lang}/remove/${id}`).subscribe(res => {
      console.log(res);
    });
  }
}
