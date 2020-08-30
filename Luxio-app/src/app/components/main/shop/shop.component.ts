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

  constructor(
    private shop_service: ShopService,
    private user_service: UserService,
    private lang_service: LanguageService
  ) { }

  public shop: any[];
  public sorted: any[];
  private no_products: boolean;
  public selectedProd: object;
  public selectedProd_Img: string;

  public fav: Array<any>;
  public langIv: boolean = false;
  public my_cart: Array<any> = JSON.parse(localStorage.getItem('my_764528_ct')) || [];
  public my_favorites: Array<any> = JSON.parse(localStorage.getItem('my_764528_f')) || [];

  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.shop = date[0];
      });

    this.shop_service.shop_products_sorted_from_service
      .subscribe(date => this.sorted = date[0]);

    this.user_service.favorite_from_service
      .subscribe(date => { this.fav = date });

    this.lang_service._selected_from_service
      .subscribe(date => {
        if (date === 'iv') {
          this.langIv = true;
        } else this.langIv = false;
      })

    // this.shop_service.prod_selected_from_service
    //   .subscribe(date => {
    //     this.selectedProd = date;
    //     // console.log(this.selectedProd);
    //   });
  }

  checkSorted() {
    if (this.sorted.length < 1) {
      this.no_products = true;
    } else this.no_products = false;
  }

  getSorted(by_class, by_color, by_tint, by_transparency) {
    let newAr = [];
    this.shop.forEach(element => {
      if (element.prod_class.includes(by_class) && element.color.includes(by_color) && element.tint.includes(by_tint) && element.transparency.includes(by_transparency)) {
        newAr.push(element);
      }
      this.shop_service.getProducts_sorted(newAr);
      this.checkSorted();
    });
  }

  getAll() {
    this.shop_service.getProducts_sorted(this.shop);
    this.no_products = false;
  }

  select(id: number) {
    this.shop.forEach(element => {
      if (element.burcode_id === id) {
        this.selectedProd = element;
        this.selectedProd_Img = element.img_link_1 || element.img_link;
      }
    });
  }
  selectImage(link: string) {
    this.selectedProd_Img = link;
  }

  closeSelected() {
    this.selectedProd = null;
    this.selectedProd_Img = null;
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
