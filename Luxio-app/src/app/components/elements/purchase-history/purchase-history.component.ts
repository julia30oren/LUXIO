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

  public userID = localStorage.getItem('u324_3i_25d');
  public languege: string;
  public orders: Array<any>;

  constructor(
    private order_service: OrderService,
    private language_Service: LanguageService,
    private admin_Service: AdminServiceService
  ) { }

  ngOnInit() {
    this.language_Service._selected_from_service
      .subscribe(date => this.languege = date);

    this.order_service.getUserOrders(this.userID);
    this.order_service.userOrders_fromService
      .subscribe(date => {
        if (date[0]) {
          this.orders = date;
        }
      })
  }

  orderResived(orderID) {
    this.admin_Service.changeOrdersStatuse(this.languege, orderID);
  }

}
