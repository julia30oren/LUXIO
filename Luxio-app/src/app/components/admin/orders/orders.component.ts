import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  public languege: string;
  public orders: Array<any>;

  constructor(
    private language_Service: LanguageService,
    private admin_Service: AdminServiceService
  ) { }

  ngOnInit() {
    // ----------------------------------------language setings----
    this.language_Service._selected_from_service//subscribing for languege
      .subscribe(date => this.languege = date);
    // ------------------ORDERS
    this.getAllOrders();
    this.admin_Service.orders_from_service
      .subscribe(date => this.orders = date)

  }

  getAllOrders() {
    this.admin_Service.getOrders();
  }

  getOrdersOfUser(user_id) {
    this.admin_Service.getOrders_ofUser(user_id);
  }

  orderClosed(order_id) {
    this.admin_Service.changeOrdersStatuse(this.languege, order_id);
  }

}
