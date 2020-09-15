import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-personal-a-card',
  templateUrl: './personal-a-card.component.html',
  styleUrls: ['./personal-a-card.component.css']
})
export class PersonalACardComponent implements OnInit {

  constructor(
    private shop_service: ShopService,
    private lang_service: LanguageService,
    private user_service: UserService
  ) { }

  public langueg: string;
  public personalArea_products: Array<any>;
  public what_to_show: string;

  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.lang_service._selected_from_service
      .subscribe(date => { this.langueg = date });

    this.user_service.user_to_show_from_service
      .subscribe(date => {
        this.what_to_show = date;
        console.log(this.what_to_show)
        if (this.what_to_show === 'cart') {
          this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_ct'));
          // this.shop_service.getProducts_sorted(cart);
        } else if (this.what_to_show === 'wishlist') {
          this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_f'));
          // this.shop_service.getProducts_sorted(wishlist);
        } else this.personalArea_products = null;
      })
  }

  delete_fromCart(item) {
    this.user_service.saveToCart(item);
    this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_ct'));
  }

  pay_onlyThis(item) {
    console.log(item);
  }

  add_toCart(item) {
    this.user_service.saveToCart(item);
  }

  remove_fromWishlist(item) {
    this.user_service.saveToFavorites(item);
    this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_f'));
  }

}
