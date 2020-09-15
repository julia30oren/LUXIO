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
    this.user_service.saveToCart(obj);
  }

  select(id: number) {
    this.itemsArray.forEach(element => {
      if (element.burcode_id === id) {
        this.shop_service.selectProd(element, true);
      }
    });
  }

}
