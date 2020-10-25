import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';

@Component({
  selector: 'app-basics',
  templateUrl: './basics.component.html',
  styleUrls: ['./basics.component.css']
})
export class BasicsComponent implements OnInit {

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
          let basics = [];

          shop.forEach(element => {
            if (element.prod_class === 'materials') {
              basics.push(element);
            }
            this.shop_service.getXtra_sorted(basics)
          });
        };
      });

    this.shop_service.select_one_from_service
      .subscribe(date => this.selectedProd = date);
  }

}
