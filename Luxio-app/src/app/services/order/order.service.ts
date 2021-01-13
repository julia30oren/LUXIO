import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { RespondService } from '../respond/respond.service';
import { environment } from '../../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private URL: string = `${environment.hostURL}:${environment.DBport}`;
  private order_URL: string = `${this.URL}/order`;

  private userOrders = new BehaviorSubject<Array<any>>([]);
  public userOrders_fromService = this.userOrders.asObservable();

  constructor(
    private http: HttpClient,
    private respond_Service: RespondService
  ) { }

  getAllOrders() {
    return this.http.get(`${this.order_URL}`).subscribe(res => {
      console.log(res);
    });
  }

  getUserOrders(id: string) {
    return this.http.get(`${this.order_URL}/${id}`).subscribe(res => {
      console.log(res);
      let orders = res[0] ? res[0].userOrders : [];
      this.userOrders.next(orders);
    });
  }

  createOrder(order: object, lang: string) {
    // console.log(order, lang)
    return this.http.post(`${this.order_URL}/${lang}/save`, order).subscribe(res => {
      // console.log(res)
      if (res[0].status) {
        localStorage.setItem('my_764528_ct', '[]')
      }
      this.respond_Service.saveRespond(res);
    });
  }

  orderResived(id: string, lang: string) {
    return this.http.get(`${this.order_URL}/${lang}/status/${id}/true`).subscribe(res => {
      this.respond_Service.saveRespond(res);
    });
  }
}
