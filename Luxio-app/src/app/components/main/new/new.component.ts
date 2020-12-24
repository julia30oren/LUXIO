import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  public languege: string;
  public my_cart: Array<any> = JSON.parse(localStorage.getItem('my_764528_ct')) || [];
  public my_favorites: Array<any> = JSON.parse(localStorage.getItem('my_764528_f')) || [];
  public shop: Array<any> = [];
  public selectedProd: boolean;

  private shadesOpen: boolean;
  private miamiOpen: boolean;
  private voyageOpen: boolean;
  public rendezvousOpen: boolean;

  public shades: Array<any> = [];
  public voyage: Array<any> = [];
  public miami: Array<any> = [];
  public rendezvous: Array<any> = [];

  constructor(
    private lang_service: LanguageService,
    private shop_service: ShopService,
    private user_service: UserService
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });

    this.shop_service.select_one_from_service
      .subscribe(date => this.selectedProd = date);

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.shop = date;
        let shop = date[0] || [];
        shop.forEach(element => {
          if (element.prod_collection === 'shades') {
            this.shades.push(element);
          } else if (element.prod_collection === 'voyage') {
            this.voyage.push(element);
          }

          else if (element.prod_collection === 'miami') {
            this.miami.push(element);
          }
          else if (element.prod_collection === 'rendezvous') {
            this.rendezvous.push(element);
          }
        });
      });
  }

  openRendezvous_shop() {
    this.rendezvousOpen = !this.rendezvousOpen;
  }

  openShades_shop() {
    this.shadesOpen = !this.shadesOpen;
  }

  openVoyage_shop() {
    this.voyageOpen = !this.voyageOpen;
  }


  openMiami_shop() {
    this.miamiOpen = !this.miamiOpen;
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

  addToFavorites(item) {
    this.user_service.saveToFavorites(item);
  }

  addToCart(item) {
    let item_toCart = {  // creating item with needed properties:
      _id: item._id,
      burcode_id: item.burcode_id,
      name: item.name,
      prod_class: item.prod_class,
      img_link_1: item.img_link_1,
      amount: item.amount_1,
      amount_1: item.amount_1,
      amount_2: item.amount_2,
      quantity: 1,
      price_1: item.price_1,
      price_2: item.price_2,
      price: item.price_1,
      total_price: item.price_1
    };
    this.user_service.saveToCart(item_toCart); //sending on service to save
  }

  select(id: number) {
    let shop = this.shop[0]
    shop.forEach(element => {
      if (element.burcode_id === id) {
        this.shop_service.selectProd(element, true);
      }
    });
  }

  closeSelected() {
    this.selectedProd = null;
  }
}
