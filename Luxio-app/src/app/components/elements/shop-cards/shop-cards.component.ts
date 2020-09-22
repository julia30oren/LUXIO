import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop/shop.service';
import { UserService } from 'src/app/services/user-servise/user.service';
import { element } from 'protractor';

@Component({
  selector: 'app-shop-cards',
  templateUrl: './shop-cards.component.html',
  styleUrls: ['./shop-cards.component.css']
})
export class ShopCardsComponent implements OnInit {

  public selectedProd: boolean;
  public my_cart: Array<any>;
  public my_favorites: Array<any>;
  public itemsArray: Array<any>;

  constructor(
    private shop_service: ShopService,
    private user_service: UserService
  ) { }

  ngOnInit() {
    this.shop_service.shop_products_sorted_from_service
      .subscribe(date => this.itemsArray = date);

    this.shop_service.my_favorites_from_service
      .subscribe(date => this.my_favorites = date);

    this.shop_service.my_cart_from_service
      .subscribe(date => this.my_cart = date);

    this.shop_service.select_one_from_service
      .subscribe(date => { this.selectedProd = date });
  }

  getClasses(id) {
    var index = this.my_favorites.findIndex(x => x._id === id);
    if (index === -1) {
      return 'hart-button grey-hart';
    } else return 'hart-button red-hart';
  }

  getCartClasse(id) {
    var index = this.my_cart.findIndex(x => x._id === id);
    if (index === -1) {
      return 'cart-button not-active';
    } else return 'cart-button active';
  }

  addToFavorites(obj) {
    this.user_service.saveToFavorites(obj);
  }

  addToCart(obj) {
    console.log(obj)
    // this.user_service.saveToCart(obj);
    let item_toCart = {
      _id: obj._id,
      burcode_id: obj.burcode_id,
      name: obj.name,
      prod_class: obj.prod_class,
      img_link_1: obj.img_link_1,
      amount: obj.amount_1,
      amount_1: obj.amount_1,
      amount_2: obj.amount_2,

      quantity: 1,
      price_1: obj.price_1,
      price_2: obj.price_2,
      price: obj.price_1,
      total_price: obj.price_1
    };
    this.user_service.saveToCart(item_toCart);
  }

  select(id: number) {
    this.itemsArray.forEach(element => {
      if (element.burcode_id === id) {
        this.shop_service.selectProd(element, true);
      }
    });
  }

}
