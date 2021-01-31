import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-personal-area',
  templateUrl: './personal-area.component.html',
  styleUrls: ['./personal-area.component.css']
})
export class PersonalAreaComponent implements OnInit {

  constructor(
    private language_Service: LanguageService,
    private router: Router,
    private shop_Service: ShopService,
    private user_Service: UserService
  ) { }
  public userID = localStorage.getItem('u324_3i_25d');
  public languege: string;
  public shop: any[];
  public what_to_show: string;

  ngOnInit() {
    this.userCheck();
    this.language_Service._selected_from_service
      .subscribe(date => { this.languege = date });

    this.shop_Service.shop_products_from_service
      .subscribe(date => {
        this.shop = date[0];
      });

    this.user_Service.user_to_show_from_service
      .subscribe(date => {
        this.what_to_show = date || 'cart';
        let cart = JSON.parse(localStorage.getItem('my_764528_ct'));
        this.shop_Service.getProducts_sorted(cart);
      });
  }

  userCheck() {
    if (!this.userID) {
      this.router.navigate(['/**']);
    }
  }

  getMyCart() {
    this.user_Service.set_showForUser('cart');
    let cart = JSON.parse(localStorage.getItem('my_764528_ct'));
    this.shop_Service.getProducts_sorted(cart);
  }

  getMyWishlist() {
    this.user_Service.set_showForUser('wishlist');
    let wishlist = JSON.parse(localStorage.getItem('my_764528_f'));
    this.shop_Service.getProducts_sorted(wishlist);
  }

  getPrivateInfo() {
    this.user_Service.set_showForUser('private-info');
  }

  getPurchaseHistory() {
    this.user_Service.set_showForUser('purchase-history');
  }

}
