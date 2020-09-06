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
  public langueg: string;
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
      .subscribe(date => { this.langueg = date });

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
    this.shop.forEach(element => {
      if (element.burcode_id === id) {
        this.shop_service.selectProd(element, true);
      }
    });
  }

  getClasses(id) {
    if (this.my_favorites.includes(id)) {
      return 'hart-button red-hart';
    } else return 'hart-button grey-hart';
  }

  getCartClasse(id) {
    if (this.my_cart.includes(id)) {
      return 'cart-button active';
    } else return 'cart-button not-active';
  }

  addToFavorites(id) {
    if (this.my_favorites.includes(id)) {
      var filtered = this.my_favorites.filter((val) => { return val !== id; });
      this.my_favorites = filtered;
      localStorage.setItem('my_764528_f', JSON.stringify(filtered));
      this.shop_service.favorites(filtered);
    } else {
      this.my_favorites.push(id);
      localStorage.setItem('my_764528_f', JSON.stringify(this.my_favorites));
      this.shop_service.cart(this.my_favorites);
    }
  }

  addToCart(id) {
    if (this.my_cart.includes(id)) {
      var filtered = this.my_cart.filter((val) => { return val !== id; });
      this.my_cart = filtered;
      localStorage.setItem('my_764528_ct', JSON.stringify(filtered));
      this.shop_service.cart(filtered);
    } else {
      this.my_cart.push(id);
      localStorage.setItem('my_764528_ct', JSON.stringify(this.my_cart));
      this.shop_service.cart(this.my_cart);
    }
  }

}
