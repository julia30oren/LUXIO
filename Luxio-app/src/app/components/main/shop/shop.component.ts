import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop/shop.service';
import { UserService } from 'src/app/services/user-servise/user.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {


  public shop: any[];
  public selectedProd: boolean;

  public fav: Array<any>;
  public langueg: string;
  public my_cart: Array<any> = JSON.parse(localStorage.getItem('my_764528_ct')) || [];
  public my_favorites: Array<any> = JSON.parse(localStorage.getItem('my_764528_f')) || [];

  constructor(
    private shop_service: ShopService,
    private user_service: UserService,
    private lang_service: LanguageService
  ) { }


  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.shop = date[0];
        this.shop_service.getProducts_sorted(this.shop);
      });

    this.user_service.favorite_from_service
      .subscribe(date => { this.fav = date });

    this.lang_service._selected_from_service
      .subscribe(date => { this.langueg = date })

    this.shop_service.select_one_from_service
      .subscribe(date => this.selectedProd = date)
  }

  getSorted(by_class, by_color, by_tint, by_transparency) {
    let newAr = [];
    this.shop.forEach(element => {
      if (element.prod_class.includes(by_class) && element.color.includes(by_color) && element.tint.includes(by_tint) && element.transparency.includes(by_transparency)) {
        newAr.push(element);
      }
      this.shop_service.getProducts_sorted(newAr);
    });
  }

  getAll() {
    this.shop_service.getProducts_sorted(this.shop);
  }

  select(id: number) {
    this.shop.forEach(element => {
      if (element.burcode_id === id) {
        this.shop_service.selectProd(element, true);
      }
    });
  }

  addToFavorites(id) {
    if (this.my_favorites.includes(id)) {
      var filtered = this.my_favorites.filter((val) => { return val !== id; });
      this.my_favorites = filtered;
      localStorage.setItem('my_764528_f', JSON.stringify(filtered))
    } else {
      this.my_favorites.push(id);
      localStorage.setItem('my_764528_f', JSON.stringify(this.my_favorites))
    }
  }

  addToCart(id) {
    if (this.my_cart.includes(id)) {
      var filtered = this.my_cart.filter((val) => { return val !== id; });
      this.my_cart = filtered;
      localStorage.setItem('my_764528_ct', JSON.stringify(filtered))
    } else {
      this.my_cart.push(id);
      localStorage.setItem('my_764528_ct', JSON.stringify(this.my_cart))
    }
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


  less(item_id) {
    console.log(item_id)
  }

  more(item_id) {
    console.log(item_id)
  }

}
