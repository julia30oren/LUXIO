import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';

@Component({
  selector: 'app-luxio',
  templateUrl: './luxio.component.html',
  styleUrls: ['./luxio.component.css']
})
export class LuxioComponent implements OnInit {

  public shop: Array<any>;
  public languege: string;

  constructor(
    private lang_service: LanguageService,
    private shop_service: ShopService
  ) { }

  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.lang_service._selected_from_service
      .subscribe(date => {
        this.languege = date;
      });

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        if (date[0]) {
          this.shop = date[0];
          let shop = date[0];
          let sorted = [];
          let basesANDtops = [];
          shop.forEach(element => {
            if (element.prod_class === "Luxio") {
              sorted.push(element);
            }
            this.shop_service.getProducts_sorted(sorted);

          });
          shop.forEach(element => {
            if (element.prod_class === 'basics') {
              basesANDtops.push(element);
            }
            this.shop_service.getXtra_sorted(basesANDtops)
          });
        };
      });
  }

}
