import { Component, OnInit } from '@angular/core';
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
    private shop_service: ShopService,
    private lang_service: LanguageService,
    private user_service: UserService
  ) { }

  public langueg: string;
  public shop: any[];
  public what_to_show: string;

  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.lang_service._selected_from_service
      .subscribe(date => { this.langueg = date });

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.shop = date[0];
      });

    this.user_service.user_to_show_from_service
      .subscribe(date => {
        this.what_to_show = date;
        console.log(this.what_to_show)
        if (this.what_to_show === 'cart') {
          let cart = JSON.parse(localStorage.getItem('my_764528_ct'));
          this.shop_service.getProducts_sorted(cart);
        } else if (this.what_to_show === 'wishlist') {
          let wishlist = JSON.parse(localStorage.getItem('my_764528_f'));
          this.shop_service.getProducts_sorted(wishlist);
        }
      })

  }

  getMyCart() {
    this.user_service.set_showForUser('cart');
    let cart = JSON.parse(localStorage.getItem('my_764528_ct'));
    this.shop_service.getProducts_sorted(cart);
  }

  getMyWishlist() {
    this.user_service.set_showForUser('wishlist');
    let wishlist = JSON.parse(localStorage.getItem('my_764528_f'));
    this.shop_service.getProducts_sorted(wishlist);
  }



}