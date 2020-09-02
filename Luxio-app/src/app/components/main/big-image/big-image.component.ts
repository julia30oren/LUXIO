import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop/shop.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-big-image',
  templateUrl: './big-image.component.html',
  styleUrls: ['./big-image.component.css']
})
export class BigImageComponent implements OnInit {

  public selectedProd: Array<any> = [];
  public selectedProd_Img: string;
  private langueg: string;
  public my_cart: Array<any>;
  public my_favorites: Array<any>;

  constructor(
    private shop_service: ShopService,
    private lang_service: LanguageService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.shop_service.prod_selected_from_service
      .subscribe(date => {
        this.selectedProd = date;
        if (this.selectedProd[0]) {
          this.selectedProd_Img = this.selectedProd[0].img_link_1 || this.selectedProd[0].img_link;
        }
      });

    this.lang_service._selected_from_service
      .subscribe(date => {
        this.langueg = date;
      });

    this.shop_service.my_favorites_from_service
      .subscribe(date => {
        this.my_favorites = date;
      });

    this.shop_service.my_cart_from_service
      .subscribe(date => {
        this.my_cart = date;
      });
  }

  selectImage(link: string) {
    this.selectedProd_Img = link;
  }

  closeSelected() {
    this.selectedProd_Img = null;
    this.shop_service.selectProd(null, false);
  }

  addToFavorites(id) {
    if (this.my_favorites.includes(id)) {
      var filtered = this.my_favorites.filter((val) => { return val !== id; });
      this.my_favorites = filtered;
      localStorage.setItem('my_764528_f', JSON.stringify(filtered));
      this.shop_service.favorites(filtered);
    } else {
      this.my_favorites.push(id);
      localStorage.setItem('my_764528_f', JSON.stringify(this.my_favorites));
      this.shop_service.favorites(this.my_favorites);
    }
  }

  addToCart(id) {
    if (this.my_cart.includes(id)) {
      var filtered = this.my_cart.filter((val) => { return val !== id; });
      this.my_cart = filtered;
      localStorage.setItem('my_764528_ct', JSON.stringify(filtered));
      this.shop_service.cart(filtered);
    } else {
      this.my_cart.push(id);
      localStorage.setItem('my_764528_ct', JSON.stringify(this.my_cart));
      this.shop_service.favorites(this.my_cart);
    }
  }

}
