import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent implements OnInit {

  public orders: Array<any>;
  constructor(
    private order_service: OrderService
  ) { }

  ngOnInit() {
    let userID = localStorage.getItem('u324_3i_25d');
    this.order_service.getUserOrders(userID);

    this.order_service.userOrders_fromService
      .subscribe(date => {
        this.orders = date;
      })

  }

}
