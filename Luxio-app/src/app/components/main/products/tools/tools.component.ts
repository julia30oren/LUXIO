import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {

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
          let accessories = [];

          shop.forEach(element => {
            if (element.prod_class === 'accessories') {
              accessories.push(element);
            }
            this.shop_service.getXtra_sorted(accessories)
          });
        };
      });

    this.shop_service.select_one_from_service
      .subscribe(date => this.selectedProd = date);
  }
}
