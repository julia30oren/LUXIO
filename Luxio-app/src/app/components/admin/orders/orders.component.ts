import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  public languege: string;
  public orders: Array<any>;
  public admin: boolean;
  constructor(
    private router: Router,
    private user_Service: UserService,
    private language_Service: LanguageService,
    private admin_Service: AdminServiceService
  ) { }

  ngOnInit() {
    this.adminCheck();
    // ----------------------------------------language setings----
    this.language_Service._selected_from_service//subscribing for languege
      .subscribe(date => this.languege = date);
    // ------------------ORDERS
    this.user_Service.asAdmin_from_service
      .subscribe(date => {
        this.admin = date;
        setTimeout(() => {
          if (this.admin) {
            this.getAllOrders();
            this.admin_Service.orders_from_service
              .subscribe(date => {
                this.orders = date
              })
          } else {
            this.router.navigate(['/**']);
          }
        }, 1000);
      });
  }

  adminCheck() {
    let adminToken = localStorage.getItem('token');
    if (adminToken) {
      this.user_Service.adminTokenCheck(adminToken);
    } else this.router.navigate(['/**']);
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
