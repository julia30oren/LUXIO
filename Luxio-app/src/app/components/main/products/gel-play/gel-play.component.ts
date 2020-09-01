import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop/shop.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-gel-play',
  templateUrl: './gel-play.component.html',
  styleUrls: ['./gel-play.component.css']
})
export class GelPlayComponent implements OnInit {

  public langueg: string;
  public selectedProd: boolean;

  constructor(
    private lang_service: LanguageService,
    private shop_service: ShopService
  ) { }

  ngOnInit() {

    this.shop_service.getProducts_fromDB();

    this.lang_service._selected_from_service
      .subscribe(date => {
        this.langueg = date;
      });

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        if (date[0]) {
          let shop = date[0];
          let sorted = [];
          shop.forEach(element => {
            if (element.prod_class === "Gel Play") {
              sorted.push(element);
              this.shop_service.getProducts_sorted(sorted);
            }
          });
        }
      });

    this.shop_service.select_one_from_service
      .subscribe(date => this.selectedProd = date);

  }

}
