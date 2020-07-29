import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop/shop.service';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  constructor(
    private shop_service: ShopService,
    private user_servic: UserService
  ) { }

  public shop: any[];
  public sorted: any[];
  public selectedProd: object;
  public fav: Array<any>;

  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.shop = date[0];
        // this.shop_service.getProducts_sorted(this.shop);
      });

    this.shop_service.shop_products_sorted_from_service
      .subscribe(date => this.sorted = date[0]);

    this.user_servic.favorite_from_service
      .subscribe(date => { this.fav = date; console.log(this.fav) });

    this.shop_service.prod_selected_from_service
      .subscribe(date => {
        this.selectedProd = date;
        // console.log(this.selectedProd);
      });
  }

  getSorted(a, b, c, d) {
    console.log(a, b, c, d);
    let newAr = [];
    this.shop.forEach(element => {
      if (element.prod_class.includes(a) && element.color.includes(b) && element.tint.includes(c) && element.transparency.includes(d)) {
        newAr.push(element);
      }
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
        console.log(element)
        // this.shop_service.selectProd(element);
      }
    });
  }

  toCart(id) {
    console.log('to cart ', id)
  }

  toFav(id) {
    console.log('to favorites ', id);
    this.shop.forEach(element => {
      if (element._id.includes(id)) {
        this.user_servic.saveToFavorites(element, id)
      }
      // this.shop_service.getProducts_sorted(newAr);
    });
  }

}
