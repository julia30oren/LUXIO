import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop/shop.service';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user-servise/user.service';


@Component({
  selector: 'app-big-image',
  templateUrl: './big-image.component.html',
  styleUrls: ['./big-image.component.css']
})
export class BigImageComponent implements OnInit {

  public selectedProd: Array<any> = [];
  public selectedProd_Img: string;
  public selectedProd_inFavorites: boolean;
  public selectedProd_inCart: boolean;

  public languege: string;
  public my_cart: Array<any> = JSON.parse(localStorage.getItem('my_764528_ct')) || [];
  public my_favorites: Array<any> = JSON.parse(localStorage.getItem('my_764528_f')) || [];
  private amount: string;
  private quantity: number;


  constructor(
    private shop_service: ShopService,
    private lang_service: LanguageService,
    private user_service: UserService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.lang_service._selected_from_service
      .subscribe(date => {
        this.languege = date;
      });

    this.shop_service.my_favorites_from_service
      .subscribe(date => {
        this.my_favorites = date;
      });
    this.shop_service.my_cart_from_service
      .subscribe(date => {
        this.my_cart = date;
      });

    this.shop_service.prod_selected_from_service
      .subscribe(date => {
        this.selectedProd = date;
        if (this.selectedProd[0]) {
          this.selectedProd_Img = this.selectedProd[0].img_link_1 || this.selectedProd[0].img_link;
          this.amount = this.selectedProd[0].amount_1;
          this.quantity = 1;

          this.my_favorites.forEach(element => { // check if selected item is in user wishlist
            if (element._id === this.selectedProd[0]._id) {
              this.selectedProd_inFavorites = true;
            }
          });
          this.my_cart.forEach(element => { // check if selected item is in user cart
            if (element._id === this.selectedProd[0]._id) {
              this.selectedProd_inCart = true;
            }
          });
        }
      });
  }

  amount_change(target) {
    this.amount = target;
  }

  quantity_change(target) {
    this.quantity = target;
  }

  selectImage(link: string) {
    this.selectedProd_Img = link;
  }

  closeSelected() {
    this.selectedProd_Img = null;
    this.shop_service.selectProd(null, false);
  }

  addToFavorites(obj) {
    this.user_service.saveToFavorites(obj);
    this.selectedProd_inFavorites = !this.selectedProd_inFavorites;
  }

  addToCart() {
    let item_toCart = { // creating item with needed properties:
      _id: this.selectedProd[0]._id,
      burcode_id: this.selectedProd[0].burcode_id,
      name: this.selectedProd[0].name,
      prod_class: this.selectedProd[0].prod_class,
      img_link_1: this.selectedProd[0].img_link_1,
      amount: this.amount,
      amount_1: this.selectedProd[0].amount_1,
      amount_2: this.selectedProd[0].amount_2,
      quantity: this.quantity,
      price_1: this.selectedProd[0].price_1,
      price_2: this.selectedProd[0].price_2,
      price: this.selectedProd[0].price_1,
      total_price: this.quantity * this.selectedProd[0].price_1
    };

    if (this.amount === this.selectedProd[0].amount_2) {
      item_toCart.price = this.selectedProd[0].price_2;
      item_toCart.total_price = this.quantity * this.selectedProd[0].price_2;
    }
    this.selectedProd_inCart = !this.selectedProd_inCart;
    setTimeout(() => {
      this.user_service.saveToCart(item_toCart);
    }, 1000);
  }

}
