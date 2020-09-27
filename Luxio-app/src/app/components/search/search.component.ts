import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public shop: Array<any>;

  constructor(
    private shop_service: ShopService,
  ) { }

  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.shop = date[0];
        if (this.shop) {
          let _txt = window.location.pathname.substring(8)
          var search_txt = _txt.replace("%20", " ");
          // console.log(search_txt)
          this.shop.forEach(element => {
            if (element.name.includes(search_txt)) {
              this.shop_service.selectProd(element, true)
            }
          });
        }
      });
  }

}
