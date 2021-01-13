import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RespondService } from '../respond/respond.service';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private URL: string = `${environment.hostURL}:${environment.DBport}`;
  private admin_URL: string = `${this.URL}/admin`;
  private orders_URL: string = `${this.URL}/order`;

  private admins = new BehaviorSubject<Array<any>>([]);
  public admins_from_service = this.admins.asObservable();

  private orders = new BehaviorSubject<Array<any>>([]);
  public orders_from_service = this.orders.asObservable();

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

  getOrders() {
    return this.http.get(`${this.orders_URL}`).subscribe(res => {
      if (res[0].status) {
        this.orders.next(res[0].allOrders);
      } else {
        this.respond_Service.saveRespond(res);
      }
    });
  }

  getOrders_ofUser(user_id) {
    return this.http.get(`${this.orders_URL}/${user_id}`).subscribe(res => {
      if (res[0].status) {
        this.orders.next(res[0].userOrders);
      } else {
        this.respond_Service.saveRespond(res);
      }
    });
  }
  changeOrdersStatuse(lang, order_id) {
    return this.http.get(`${this.orders_URL}/${lang}/status/${order_id}/${true}`).subscribe(res => {
      this.respond_Service.saveRespond(res);
      this.getOrders();
    });
  }

  deleteAdmin_fromDB(id: string, lang: string) {
    return this.http.get(`${this.admin_URL}/${lang}/remove/${id}`).subscribe(res => {
      console.log(res);
    });
  }
}
