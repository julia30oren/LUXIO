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
  public selectedProd: object;
  public fav: Array<any>;
  public lang: string;

  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.shop = date[0];
        // this.shop_service.getProducts_sorted(this.shop);
      });

    this.shop_service.shop_products_sorted_from_service
      .subscribe(date => this.sorted = date[0]);

    this.user_service.favorite_from_service
      .subscribe(date => { this.fav = date; console.log(this.fav) });

    // this.lang_service._selected_from_service
    //   .subscribe(date => { this.lang = date; console.log(this.lang) })

    // this.shop_service.prod_selected_from_service
    //   .subscribe(date => {
    //     this.selectedProd = date;
    //     // console.log(this.selectedProd);
    //   });
  }

  getSorted(a, b, c, d) {
    // console.log(a, b, c, d);
    let newAr = [];
    this.shop.forEach(element => {
      if (element.prod_class.includes(a) && element.color.includes(b) && element.tint.includes(c) && element.transparency.includes(d)) {
        newAr.push(element);
      }
      // else if (newAr[0]) {
      //   this.noMatchFound = true;
      // }
      this.shop_service.getProducts_sorted(newAr);
    });
  }

  getAll() {
    this.shop_service.getProducts_sorted(this.shop);
  }

  select(id: number) {
    // console.log(id);
    this.shop.forEach(element => {
      if (element.burcode_id === id) {
        this.selectedProd = element;
        // console.log(this.selectedProd);
      }
    });
  }
  closeSelected() {
    this.selectedProd = null;
  }

  toCart(id) {
    console.log('to cart ', id)
  }

  toFav(id) {
    console.log('to favorites ', id);
    this.shop.forEach(element => {
      if (element._id.includes(id)) {
        this.user_service.saveToFavorites(element, id)
      }
      // this.shop_service.getProducts_sorted(newAr);
    });
  }

  less(item_id) {
    console.log(item_id)
  }

  more(item_id) {
    console.log(item_id)
  }

}
