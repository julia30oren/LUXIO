import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop/shop.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-optionss',
  templateUrl: './optionss.component.html',
  styleUrls: ['./optionss.component.css']
})

export class OptionssComponent implements OnInit {

  public shop: Array<any>;
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
          this.shop = date[0];
          let shop = date[0];
          let sorted = [];
          let aurora = [];
          shop.forEach(element => {
            if (element.prod_collection === 'aurora') {
              sorted.push(element);
            }
            this.shop_service.getProducts_sorted(sorted);

          });
          shop.forEach(element => {
            if (element.prod_class === "Options" && element.prod_collection !== 'aurora') {
              aurora.push(element);
            }
            this.shop_service.getXtra_sorted(aurora)
          });
        };
      });

    this.shop_service.select_one_from_service
      .subscribe(date => this.selectedProd = date);
  }

}
