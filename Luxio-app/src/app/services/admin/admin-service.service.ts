import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RespondService } from '../respond/respond.service';
import { environment } from '../../../environments/environment'
import { UserService } from '../user-servise/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  public admin_URL: string = `${environment.hostURL}:${environment.DBport}/admin`;
  private orders_URL: string = `${environment.hostURL}:${environment.DBport}/order`;

  private admins = new BehaviorSubject<Array<any>>([]);
  public admins_from_service = this.admins.asObservable();

  private orders = new BehaviorSubject<Array<any>>([]);
  public orders_from_service = this.orders.asObservable();

  constructor(
    private http: HttpClient,
    private respond_Service: RespondService,
    private user_Service: UserService
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
  // --------------------------------------------------DELETE ADMIN by id
  deleteAdmin_fromDB(id: string, lang: string) {
    return this.http.get(`${this.admin_URL}/${lang}/remove/${id}`).subscribe(res => {
      this.respond_Service.saveRespond(res);
      this.getAdmins_fromDB();
    });
  }
  // --------------------------------------------------CREATE NEW ADMIN
  createAdmin(admin: object, lang: string) {
    return this.http.post(`${this.admin_URL}/${lang}/create`, admin).subscribe(res => {
      this.respond_Service.saveRespond(res);
    });
  }

  getOrders() {
    return this.http.get(`${this.orders_URL}`).subscribe(res => {
      if (res[0].status) {
        this.orders.next(res[0].allOrders);
      } else {
        this.respond_Service.saveRespond(res);
      }
    });
  }

  getOrders_ofUser(user_id: string) {
    return this.http.get(`${this.orders_URL}/${user_id}`).subscribe(res => {
      if (res[0].status) {
        this.orders.next(res[0].userOrders);
      } else {
        this.respond_Service.saveRespond(res);
      }
    });
  }

  changeOrdersStatuse(lang: string, order_id: string) {
    return this.http.get(`${this.orders_URL}/${lang}/status/${order_id}/${true}`).subscribe(res => {
      this.respond_Service.saveRespond(res);
      this.getOrders();
    });
  }

  deleteCommentByID(lang: string, comment_id: string) {
    return this.http.get(`${this.orders_URL}/${lang}/remove/${comment_id}`).subscribe(res => {
      this.respond_Service.saveRespond(res);
      if (res[0].status) { // save new comments
        this.user_Service.saveCommentsOnService(res[0].newComments);
      }
    });
  }
}
