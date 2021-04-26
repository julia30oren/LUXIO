import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop/shop.service';
import { UserService } from 'src/app/services/user-servise/user.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-wide-cards',
  templateUrl: './wide-cards.component.html',
  styleUrls: ['./wide-cards.component.css']
})
export class WideCardsComponent implements OnInit {

  public wideCardProductes: Array<any> = [];
  public shop: Array<any>;
  public selectedProd: boolean;
  public languege: string;
  public my_cart: Array<any>;
  public my_favorites: Array<any>;

  constructor(
    private shop_service: ShopService,
    private user_service: UserService,
    private lang_service: LanguageService
  ) { }

  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });

    this.shop_service.xtra_products_sorted_from_service
      .subscribe(date => this.wideCardProductes = date)

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.shop = date[0];
      });

    this.shop_service.select_one_from_service
      .subscribe(date => this.selectedProd = date);

    this.shop_service.my_favorites_from_service
      .subscribe(date => this.my_favorites = date);

    this.shop_service.my_cart_from_service
      .subscribe(date => this.my_cart = date);
  }

  select(id: number) {
    let index = this.shop.findIndex((element) => element.burcode_id === id); //geting index of item by id
    this.shop_service.selectProd(index, true); //sending index to server and seting bog-image-component open(true)
  }

  getClasses(id) {
    if (this.my_favorites !== null) {
      var index = this.my_favorites.findIndex(x => x._id === id);
      if (index === -1) {
        return 'hart-button grey-hart';
      } else return 'hart-button red-hart';
    } else return 'hart-button grey-hart';
  }

  getCartClasse(id) {
    if (this.my_cart !== null) {
      var index = this.my_cart.findIndex(x => x._id === id);
      if (index === -1) {
        return 'cart-button not-active';
      } else return 'cart-button active';
    } else return 'cart-button not-active';
  }

  addToFavorites(item) {
    this.user_service.saveToFavorites(item, this.languege);
  }

  addToCart(item) {
    let item_toCart = {  // creating item with needed properties:
      _id: item._id,
      burcode_id: item.burcode_id,
      name: item.name,
      prod_class: item.prod_class,
      img_link_1: item.img_link_1,
      amount: item.amount_1,
      amount_1: item.amount_1,
      amount_2: item.amount_2,
      quantity: 1,
      price_1: item.price_1,
      price_2: item.price_2,
      price: item.price_1,
      total_price: item.price_1
    };
    this.user_service.saveToCart(item_toCart, this.languege); //sending on service to save
  }

}
