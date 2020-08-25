import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  private langIv: boolean;
  private shadesOpen: boolean;
  private voyageOpen: boolean;
  private fascinationOpen: boolean;
  public selectedProd: object;

  public my_cart: Array<any> = JSON.parse(localStorage.getItem('my_764528_ct')) || [];
  public my_favorites: Array<any> = JSON.parse(localStorage.getItem('my_764528_f')) || [];
  public shades: Array<any> = [];
  public voyage: Array<any> = [];
  public fascination: Array<any> = [];

  constructor(
    private lang_service: LanguageService,
    private shop_service: ShopService
  ) { }

  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.lang_service._selected_from_service
      .subscribe(date => {
        if (date === 'iv') {
          this.langIv = true;
        } else this.langIv = false;
        // console.log(date)
      })


    this.shop_service.shop_products_from_service
      .subscribe(date => {
        let shop = date[0] || [];
        shop.forEach(element => {
          if (element.prod_collection === 'shades') {
            this.shades.push(element);
          } else if (element.prod_collection === 'voyage') {
            this.voyage.push(element);
          }
          else if (element.prod_collection === 'fascination') {
            this.fascination.push(element);
          }
        });
      });
  }

  openShades_shop() {
    this.shadesOpen = !this.shadesOpen;
  }

  openVoyage_shop() {
    this.voyageOpen = !this.voyageOpen;
  }

  openFascination_shop() {
    this.fascinationOpen = !this.fascinationOpen;
  }

  getClasses(id) {
    if (this.my_favorites.includes(id)) {
      return 'hart-button red-hart';
    } else return 'hart-button grey-hart';
  }

  getCartClasse(id) {
    if (this.my_cart.includes(id)) {
      return 'cart-button active';
    } else return 'cart-button not-active';
  }

  addToFavorites(id) {
    if (this.my_favorites.includes(id)) {
      var filtered = this.my_favorites.filter((val) => { return val !== id; });
      this.my_favorites = filtered;
      localStorage.setItem('my_764528_f', JSON.stringify(filtered))
    } else {
      this.my_favorites.push(id);
      localStorage.setItem('my_764528_f', JSON.stringify(this.my_favorites))
    }
  }

  addToCart(id) {
    if (this.my_cart.includes(id)) {
      var filtered = this.my_cart.filter((val) => { return val !== id; });
      this.my_cart = filtered;
      localStorage.setItem('my_764528_ct', JSON.stringify(filtered))
    } else {
      this.my_cart.push(id);
      localStorage.setItem('my_764528_ct', JSON.stringify(this.my_cart))
    }
  }

  select(id: number) {
    this.shades.forEach(element => {
      if (element.burcode_id === id) {
        this.selectedProd = element;
      }
    });
    this.voyage.forEach(element => {
      if (element.burcode_id === id) {
        this.selectedProd = element;
      }
    });
    this.fascination.forEach(element => {
      if (element.burcode_id === id) {
        this.selectedProd = element;
      }
    });
  }

  closeSelected() {
    this.selectedProd = null;
  }
}
