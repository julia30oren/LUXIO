import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-shop-cards',
  templateUrl: './shop-cards.component.html',
  styleUrls: ['./shop-cards.component.css']
})
export class ShopCardsComponent implements OnInit {

  public selectedProd: boolean;
  public languege: string;
  public shop: Array<any>;
  public my_cart: Array<any>;
  public my_favorites: Array<any>;
  public itemsArray: Array<any> = [];

  constructor(
    private shop_service: ShopService,
    private lang_service: LanguageService,
    private user_service: UserService
  ) { }

  ngOnInit() {
    this.shop_service.shop_products_from_service
      .subscribe(date => {
        if (date[0]) {
          this.shop = date[0];
        }
      });

    this.lang_service._selected_from_service
      .subscribe(date => {
        this.languege = date;
      });

    this.shop_service.shop_products_sorted_from_service
      .subscribe(date => {
        this.itemsArray = date;
      });

    this.shop_service.my_favorites_from_service
      .subscribe(date => this.my_favorites = date);

    this.shop_service.my_cart_from_service
      .subscribe(date => this.my_cart = date);

    this.shop_service.select_one_from_service
      .subscribe(date => { this.selectedProd = date });
  }

  getClasses(id) {
    if (this.my_favorites !== null) {
      var index = this.my_favorites.findIndex(x => x._id === id);
      if (index === -1) {
        return 'hart-button grey-hart';
      } else return 'hart-button red-hart';
    } return 'hart-button grey-hart';
  }

  getCartClasse(id) {
    if (this.my_cart !== null) {
      var index = this.my_cart.findIndex(x => x._id === id);
      if (index === -1) {
        return 'cart-button not-active';
      } else return 'cart-button active';
    } return 'cart-button not-active';
  }

  addToFavorites(item) {
    this.user_service.saveToFavorites(item, this.languege);
  }

  addToCart(item) {
    item.amount = item.amount_1;
    item.quantity = 1;
    item.price = item.price_1;
    item.total_price = item.price_1;
    //sending on service to save
    this.user_service.saveToCart(item, this.languege);
  }

  select(id: number) {
    let index = this.shop.findIndex((element) => element.burcode_id === id); //geting index of item by id
    this.shop_service.selectProd(index, true); //sending index to server and seting bog-image-component open(true)
  }

}
