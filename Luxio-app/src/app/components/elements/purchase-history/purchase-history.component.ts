import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { LanguageService } from 'src/app/services/language.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent implements OnInit {

  public orders: Array<any>;
  public languege: string;

  constructor(
    private order_service: OrderService,
    private language_Service: LanguageService,
    private admin_Service: AdminServiceService
  ) { }

  ngOnInit() {
    let userID = localStorage.getItem('u324_3i_25d');
    this.order_service.getUserOrders(userID);
    // ----------------------------------------language setings----
    this.language_Service._selected_from_service//subscribing for languege
      .subscribe(date => this.languege = date);
    // -----------
    this.order_service.userOrders_fromService
      .subscribe(date => {
        this.orders = date;
      })
  }

  orderClosed(order_id) {
    this.admin_Service.changeOrdersStatuse(this.languege, order_id);
  }

}
