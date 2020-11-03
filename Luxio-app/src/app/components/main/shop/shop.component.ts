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
        this.shop_service.getProducts_sorted(this.shop);
      });

    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });
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

}