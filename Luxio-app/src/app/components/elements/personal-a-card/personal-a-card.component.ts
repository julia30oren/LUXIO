import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
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
    private language_Service: LanguageService,
    private shop_service: ShopService,
    private user_service: UserService
  ) { }

  public languege: string;
  public personalArea_products: Array<any>;
  public what_to_show: string;
  public message: string;
  public TOTAL_PRICE: number = 0;

  ngOnInit() {
    this.language_Service._selected_from_service
      .subscribe(date => { this.languege = date });

    this.user_service.user_to_show_from_service
      .subscribe(date => {
        console.log(date)
        this.what_to_show = date;
        console.log(this.what_to_show)
        if (this.what_to_show === 'cart') {
          this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_ct'));
          this.getTotalPrice();
        }
        else if (this.what_to_show === 'wishlist') {
          this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_f'));
        }
        else this.personalArea_products = null;
      })
  }


  getTotalPrice() {
    this.TOTAL_PRICE = 0;
    this.personalArea_products.forEach(element => {
      this.TOTAL_PRICE = this.TOTAL_PRICE + element.total_price;
    });
  }

  delete_fromCart(item) {
    this.user_service.saveToCart(item);
    this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_ct'));
    this.getTotalPrice();
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

  quantity_change(item, val) {
    this.user_service.saveToCart(item);
    item.quantity = val;
    item.total_price = item.quantity * item.price;
    this.user_service.saveToCart(item);
    this.getTotalPrice();
  }

  amount_change(item, val) {
    this.user_service.saveToCart(item);
    item.amount = val;
    if (item.amount === item.amount_1) {
      item.price = item.price_1;
      item.total_price = item.quantity * item.price;
      this.user_service.saveToCart(item);
    } else if (item.amount === item.amount_2) {
      item.price = item.price_2;
      item.total_price = item.quantity * item.price;
      this.user_service.saveToCart(item);
    }
    this.getTotalPrice();

  }

  select(id: number) {
    this.personalArea_products.forEach(element => {
      if (element.burcode_id === id) {
        // console.log(element);
        this.shop_service.selectProd(element, true);
      }
    });
  }

}
