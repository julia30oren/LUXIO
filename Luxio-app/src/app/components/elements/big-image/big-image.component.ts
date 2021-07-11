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

  public allProducts: Array<any> = [];
  public selectedIndex: number;
  public selectedProd: Array<any> = [];
  public selectedProd_Img: string;
  public selectedProd_inFavorites: boolean;
  public selectedProd_inCart: boolean;

  public languege: string;
  public my_cart: Array<any> = localStorage.getItem('my_764528_ct') ? JSON.parse(localStorage.getItem('my_764528_ct')) : [];
  public my_favorites: Array<any> = localStorage.getItem('my_764528_f') ? JSON.parse(localStorage.getItem('my_764528_f')) : [];
  public amount: string;
  public quantity: number = 1;
  public price: number;

  constructor(
    private shop_service: ShopService,
    private lang_service: LanguageService,
    private user_service: UserService
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => {
        this.languege = date;
      });

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        if (date[0]) {
          this.allProducts = date[0];
        }
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
        this.selectedIndex = date;
        this.getSelected();
      });
  }

  getSelected() {
    let i = this.selectedIndex;
    this.selectedProd_inCart = false;
    this.selectedProd_inFavorites = false;
    this.selectedProd = [this.allProducts[i]];
    this.selectedProd_Img = this.selectedProd[0].img_link_1;
    this.amount = this.selectedProd[0].amount_1;
    this.quantity = this.selectedProd[0].quantity;
    this.price = this.selectedProd[0].price;

    if (this.my_favorites !== null) {
      this.my_favorites.forEach(element => { // check if selected item is in user wishlist
        if (element._id === this.allProducts[i]._id) this.selectedProd_inFavorites = true;
      });
    } else this.selectedProd_inFavorites = false;
    if (this.my_cart !== null) { // check if selected item is in user cart
      this.my_cart.forEach(element => {
        if (element._id === this.selectedProd[0]._id) this.selectedProd_inCart = true;
      });
    } else this.selectedProd_inCart = false;
  }

  amount_change(target) {
    target = JSON.parse(target);
    this.amount = target[0].amount;
    this.price = target[0].price;
    console.log(this.amount, this.price)
  }

  quantity_change(target) {
    this.quantity = parseInt(target);
  }

  selectImage(link: string) {
    this.selectedProd_Img = link;
  }

  closeSelected() {
    this.selectedProd = [];
    this.selectedProd_Img = null;
    this.shop_service.selectProd(null, false);
  }

  addToFavorites_orDelete(item: any) {
    if (this.selectedProd_inFavorites) {
      this.user_service.deleteItemFromFavorites(item._id, this.languege);
    } else {
      //sending on service to save
      this.user_service.saveItemToFavorites(item, this.languege);
    }
  }

  addToCart_orDelete(item: any) {
    if (this.selectedProd_inCart) {
      this.user_service.deleteItemFromCart(item._id, this.languege); // to delete from cart
    } else {
      // edding nessesory properties
      item.amount = this.amount;
      item.quantity = this.quantity;
      item.price = this.price;
      item.total_price = this.quantity * this.price;
      //sending on service to save
      this.user_service.saveItemToCart(item, this.languege);
    }
    this.selectedProd_inCart = !this.selectedProd_inCart;
  }

  getPrev() {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.allProducts.length - 1;
    } else {
      this.selectedIndex = this.selectedIndex - 1;
    }
    this.getSelected();
  }

  getNext() {
    if (this.selectedIndex === this.allProducts.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex = this.selectedIndex + 1;
    }
    this.getSelected();
  }

}
