import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';

@Component({
  selector: 'app-luxio',
  templateUrl: './luxio.component.html',
  styleUrls: ['./luxio.component.css']
})
export class LuxioComponent implements OnInit {


  public langueg: string;
  public basesANDtops: Array<any> = [];
  public selectedProd: boolean;
  public my_cart: Array<any>;
  public my_favorites: Array<any>;

  constructor(
    private lang_service: LanguageService,
    private shop_service: ShopService
  ) { }

  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.lang_service._selected_from_service
      .subscribe(date => {
        this.langueg = date;
      });

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        if (date[0]) {
          let shop = date[0];
          let sorted = [];
          shop.forEach(element => {
            if (element.prod_class === "Luxio") {
              sorted.push(element);
              this.shop_service.getProducts_sorted(sorted);
            }
          });
          shop.forEach(element => {
            if (element.prod_class === 'basics') {
              this.basesANDtops.push(element);
            }
          });
        };
      });

    this.shop_service.select_one_from_service
      .subscribe(date => this.selectedProd = date);

    this.shop_service.my_favorites_from_service
      .subscribe(date => this.my_favorites = date);

    this.shop_service.my_cart_from_service
      .subscribe(date => this.my_cart = date);
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

  select(id: number) {
    this.basesANDtops.forEach(element => {
      if (element.burcode_id === id) {
        this.shop_service.selectProd(element, true);
      }
    });
  }

}
