import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';

@Component({
  selector: 'app-coating',
  templateUrl: './coating.component.html',
  styleUrls: ['./coating.component.css']
})
export class CoatingComponent implements OnInit {

  public languege: string;
  public shop: Array<any>;

  constructor(
    private lang_service: LanguageService,
    private shop_service: ShopService
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.shop = date;
      }
      )
  }

  openBig(id) {
    let shop = this.shop[0];
    let index = shop.findIndex((element) => element.burcode_id === id); //geting index of item by id
    this.shop_service.selectProd(index, true); //sending index to server and seting bog-image-component open(true)
  }

}
