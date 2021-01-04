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

  public languege: string;
  public moreButtonVisible: boolean = true;
  public shopToShow: any[];
  public shop: any[];

  constructor(
    private shop_service: ShopService,
    private lang_service: LanguageService
  ) { }


  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.shop = date[0];
        this.shopToShow = [];
        this.shop_service.getProducts_sorted(this.shop);
        if (date[0]) {
          this.shopToShow = [];
          for (let i = 0; i < 30; i++) {
            this.shopToShow.push(date[0][i]);
          }
          this.shop_service.getProducts_sorted(this.shopToShow);
        }
      });

    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });
  }

  getSorted(by_class, by_color, by_tint, by_transparency) {
    // this.moreButtonVisible = false;
    let newAr = [];

    this.shop.forEach(element => {
      if (element.prod_class.includes(by_class) && element.color.includes(by_color) && element.tint.includes(by_tint) && element.transparency.includes(by_transparency)) {
        newAr.push(element);
      }
      this.shopToShow = newAr;
      this.shop_service.getProducts_sorted(newAr);
    });
  }

  getAll() {
    if (this.shop[0]) {
      this.shopToShow = [];
      for (let i = 0; i < 30; i++) {
        this.shopToShow.push(this.shop[i]);
      }
      this.shop_service.getProducts_sorted(this.shopToShow);
    }
    this.moreButtonVisible = true;
  }

  select(id: number) {
    console.log('click')
    let index = this.shop.findIndex((element) => element.burcode_id === id);
    console.log(this.shop)
    // this.shop.forEach(element => {
    //   if (element.burcode_id === id) {
    //     this.shop_service.selectProd(element, true, index);
    //   }
    // });
  }

  moreProducts() {
    let x = this.shopToShow.length;
    let y = x + 30;
    if (this.shop[0]) {
      if (y < this.shop.length) {
        for (let i = x; i < y; i++) {
          this.shopToShow.push(this.shop[i]);
        }
        this.shop_service.getProducts_sorted(this.shopToShow);
      } else this.shop_service.getProducts_sorted(this.shop);
    }
  }

}