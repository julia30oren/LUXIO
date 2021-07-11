import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
  public finde: boolean;

  constructor(
    private shop_service: ShopService,
    private lang_service: LanguageService,
    private user_service: UserService
  ) { }

  ngOnInit() {
    this.shop_service.shop_products_from_service
      .subscribe(date => { if (date[0]) { this.shop = date[0] } });

    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });

    this.shop_service.shop_products_sorted_from_service
      .subscribe(date => { this.itemsArray = date; });

    this.shop_service.my_favorites_from_service
      .subscribe(date => this.my_favorites = date);

    this.shop_service.my_cart_from_service
      .subscribe(date => this.my_cart = date);

    this.shop_service.select_one_from_service
      .subscribe(date => { this.selectedProd = date });
  }



  // ------------------------------------------------------ chack COLOR FAVORITES
  getClasses(id: string) {
    if (this.my_favorites !== null) {
      var index = this.my_favorites.findIndex(x => x._id === id);
      if (index === -1) {
        return 'not-active';
      } else return 'active';
    } return 'not-active';
  }

  async ifItemExistInFavorites(item) {// checking if item need to be added or deleted
    for (var i = 0; i < this.my_favorites.length; i++) {
      if (this.my_favorites[i]._id === item._id) {
        this.finde = true;
        break;
      } else this.finde = false;
    } return;
  };
  // ---------------------------------------------------------------ADD TO FAVORITES
  async addToFavorites_orDelete(e: any, item: any) {
    await this.ifItemExistInFavorites(item); // waiting to finish checking if item need to be added or deleted
    if (this.finde) {
      this.user_service.deleteItemFromFavorites(item._id, this.languege);
      this.finde = undefined;
      e.target.className = 'fas fa-heart not-active';// ----- CHANGING COLOR OF CART
    } else {
      //sending on service to save
      this.user_service.saveItemToFavorites(item, this.languege);
      this.finde = undefined;
      e.target.className = 'fas fa-heart active';// ----- CHANGING COLOR OF CART
    }
  }






  // ------------------------------------------------------ chack COLOR OF CART
  getCartClasse(id: string) {
    if (this.my_cart !== null) {
      var index = this.my_cart.findIndex(x => x._id === id);
      if (index === -1) {
        return 'not-active';
      } else return 'active';
    } return 'not-active';
  }

  async ifItemExistInCart(item) {// checking if item need to be added or deleted
    for (var i = 0; i < this.my_cart.length; i++) {
      if (this.my_cart[i]._id === item._id) {
        this.finde = true;
        break;
      } else this.finde = false;
    } return;
  };
  // -------------------------------------------------------- ADD TO CART OR DELETE
  async addToCart_orDelete(e: any, item: any) {
    await this.ifItemExistInCart(item); // waiting to finish checking if item need to be added or deleted
    if (this.finde) {
      this.user_service.deleteItemFromCart(item._id, this.languege);
      this.finde = undefined;
      e.target.className = 'fas fa-shopping-basket not-active';// ----- CHANGING COLOR OF CART
    } else {
      // edding nessesory properties
      item.amount = item.amount_1;
      item.quantity = 1;
      item.price = item.price_1;
      item.total_price = item.price_1;
      //sending on service to save
      this.user_service.saveItemToCart(item, this.languege);
      this.finde = undefined;
      e.target.className = 'fas fa-shopping-basket active';// ----- CHANGING COLOR OF CART
    }
  }

  // -----------------------------------------OPEN ITEM BIG
  select(id: number) {
    let index = this.shop.findIndex((element) => element.burcode_id === id); //geting index of item by id
    this.shop_service.selectProd(index, true); //sending index to server and seting bog-image-component open(true)
  }

}