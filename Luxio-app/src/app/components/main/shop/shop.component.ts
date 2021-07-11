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

  public filterClass = '';
  public filterColor = '';

  itemsFilter = {};

  public languege: string;
  public doSortState: boolean = false;
  public moreButtonVisible: boolean = true;
  public shopToShow: any[];
  public shop: any[];
  public noneFound: boolean = false;

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
          for (let i = 0; i < 60; i++) {
            this.shopToShow.push(date[0][i]);
          }
          this.shop_service.getProducts_sorted(this.shopToShow);
        }
      });

    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });
  }

  doSort() {
    this.doSortState = !this.doSortState
  }

  getSorted(classVal, colorVal, tintVal, transparencyVal) {
    let newAr = [];
    if (classVal === 'accessories') {
      newAr = this.shop.filter(item => {
        if (item.prod_class.includes('accessories')) {
          return item;
        }
      })
    } else {
      let itemsFilter = {
        prod_class: classVal ? classVal : '',
        color: colorVal ? colorVal : '',
        tint: tintVal ? tintVal : '',
        transparency: transparencyVal ? transparencyVal : ''
      };

      newAr = this.shop.filter(item => {
        if (item.prod_class.includes(itemsFilter.prod_class)
          && item.color.includes(itemsFilter.color)
          && item.tint.includes(itemsFilter.tint)
          && item.transparency.includes(itemsFilter.transparency)) {
          return item;
        }
      })
    }
    newAr.length < 1 ? this.noneFound = true : this.noneFound = false;
    this.shopToShow = newAr;
    this.shop_service.getProducts_sorted(newAr);
  }

  getAll() {
    if (this.shop[0]) {
      this.shopToShow = [];
      for (let i = 0; i < 60; i++) {
        this.shopToShow.push(this.shop[i]);
      }
      this.shop_service.getProducts_sorted(this.shopToShow);
    }
    this.moreButtonVisible = true;
  }

  moreProducts() {
    let x = this.shopToShow.length;
    let y = x + 60;
    if (this.shop[0]) {
      if (y < this.shop.length) {
        for (let i = x; i < y; i++) {
          this.shopToShow.push(this.shop[i]);
        }
        this.shop_service.getProducts_sorted(this.shopToShow);
      } else this.shop_service.getProducts_sorted(this.shop);
    }
  }

  // getFillter(classVal, colorVal, tintVal) {

  //   this.itemsFilter = {
  //     prod_class: classVal ? classVal : '',
  //     color: colorVal ? colorVal : '',
  //     tint: tintVal ? tintVal : ''
  //   };

  // }

}