import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';

@Component({
  selector: 'app-pro-formance',
  templateUrl: './pro-formance.component.html',
  styleUrls: ['./pro-formance.component.css']
})
export class ProFormanceComponent implements OnInit {

  public shop: Array<any>;
  public languege: string;
  public selectedProd: boolean;

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
          let proFormance = [];

          shop.forEach(element => {
            if (element.prod_class === 'Hard GEL') {
              proFormance.push(element);
            }
            this.shop_service.getXtra_sorted(proFormance)
          });
        };
      });

    this.shop_service.select_one_from_service
      .subscribe(date => this.selectedProd = date);
  }
}