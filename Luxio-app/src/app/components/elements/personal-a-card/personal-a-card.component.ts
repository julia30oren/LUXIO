import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';
import { UserService } from 'src/app/services/user-servise/user.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-personal-a-card',
  templateUrl: './personal-a-card.component.html',
  styleUrls: ['./personal-a-card.component.css']
})
export class PersonalACardComponent implements OnInit {
  public frmShipment: FormGroup;

  constructor(
    private fb: FormBuilder,
    private language_Service: LanguageService,
    private shop_service: ShopService,
    private user_service: UserService,
    private order_service: OrderService
  ) { this.frmShipment = this.createSignupForm(); }

  public languege: string;
  public allProd: Array<any>;
  public personalArea_products: Array<any>;
  public what_to_show: string;
  public message: string;
  public TOTAL_PRICE: number = 0;
  public discount: number = 0;
  public shipping: number = 0;
  public do_checkout: boolean;
  public Checkout_Payments: Array<any>;
  public order: Array<any>;
  public user: Array<any>;
  public isSubmited: boolean;

  ngOnInit() {
    this.language_Service._selected_from_service
      .subscribe(date => { this.languege = date });

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.allProd = date[0];
      });

    this.user_service.getUser(localStorage.getItem('u324_3i_25d'), this.languege);
    this.user_service.user_full_from_service
      .subscribe(date => {
        this.user = date;
      });

    this.user_service.user_to_show_from_service
      .subscribe(date => {
        this.what_to_show = date;
        if (this.what_to_show === 'cart' && JSON.parse(localStorage.getItem('my_764528_ct'))) {
          this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_ct'));
          this.getTotalPrice();
        }
        else if (this.what_to_show === 'wishlist' && JSON.parse(localStorage.getItem('my_764528_f'))) {
          this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_f'));
        }
        else this.personalArea_products = null;
      });

    this.shop_service.orderToPay_from_service
      .subscribe(date => {
        this.order = date;
      });
  }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        phoneN: ['', Validators.compose([Validators.required])],
        city: ['', Validators.compose([Validators.required])],
        street: ['', Validators.compose([Validators.required])],
        home: ['', Validators.compose([Validators.required])],
        apartment: [""],
        zip: [null]
      }
    );
  }

  getTotalPrice() {
    this.TOTAL_PRICE = 0;
    this.discount = 0;
    let x = 0;
    if (this.personalArea_products) {
      this.personalArea_products.forEach(element => {
        if (element.price === 117 || element.price === 112) {
          x = x + element.quantity;
        }
        this.TOTAL_PRICE = this.TOTAL_PRICE + element.total_price;
      });
      this.discount = Math.trunc(x / 6) * 117;
      this.TOTAL_PRICE = this.TOTAL_PRICE - this.discount;
      if (this.TOTAL_PRICE < 1000) {
        this.shipping = 40;
        this.TOTAL_PRICE = this.TOTAL_PRICE + this.shipping;
      } else this.shipping = 0;
    }
  }

  delete_fromCart(item) {
    this.user_service.saveToCart(item);

    setTimeout(() => {
      this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_ct'));
      this.getTotalPrice();
    }, 1000);
  }

  closePaimentForm() {
    this.do_checkout = false;
  }

  add_toCart(item_id) {
    this.allProd.forEach(element => {
      if (element._id === item_id) {
        element.amount = element.amount_1;
        element.price = element.price_1;
        element.quantity = 1;
        element.total_price = element.price_1;
        this.user_service.saveToCart(element);
      }
    });
  }

  remove_fromWishlist(item) {
    this.user_service.saveToFavorites(item);

    setTimeout(() => {
      this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_f'));
    }, 1000);
  }

  quantity_change(item, val) {
    this.personalArea_products.forEach(element => {
      if (element._id === item._id) {
        element.quantity = JSON.parse(val);
        element.total_price = element.quantity * element.price;
      }
    });
    this.user_service.saveCart_toDB(this.personalArea_products);
    this.getTotalPrice();
  }

  amount_change(item, val) {
    item.amount = val;
    this.user_service.saveToCart(item);

    if (item.amount === item.amount_1) {
      item.price = item.price_1;
      item.total_price = item.quantity * item.price;
      this.user_service.saveToCart(item);
    } else if (item.amount === item.amount_2) {
      item.price = item.price_2;
      item.total_price = item.quantity * item.price;
      this.user_service.saveToCart(item);
    }
    this.getTotalPrice();
  }

  select(id: number) {
    let index = this.personalArea_products.findIndex((element) => element.burcode_id === id); //geting index of item by id
    this.shop_service.selectProd(index, true); //sending index to server and seting big-image-component open(true)
  }

  pay_onlyThis(item) {
    this.frmShipment.value.city = this.user[0].city;
    this.frmShipment.value.phoneN = this.user[0].phoneN;
    this.frmShipment.value.street = this.user[0].street;
    this.frmShipment.value.home = this.user[0].home;
    this.frmShipment.value.apartment = this.user[0].apartment;
    this.frmShipment.value.zip = this.user[0].zip;

    this.shop_service.createOreder([item]);
    this.getTotalPriceForOneItem(item);
    this.do_checkout = true;
  }

  getTotalPriceForOneItem(itemToOrder) {
    let Checkout_ForOneItem = {
      totalPrice: itemToOrder.total_price,
      shipping: 40,
      discount: 0
    };
    let x = 0;
    if (itemToOrder.price === 117 || itemToOrder.price === 112) { x = itemToOrder.quantity; }
    Checkout_ForOneItem.discount = Math.trunc(x / 6) * 117;
    Checkout_ForOneItem.totalPrice = Checkout_ForOneItem.totalPrice - Checkout_ForOneItem.discount;
    if (Checkout_ForOneItem.totalPrice < 1000) {
      Checkout_ForOneItem.shipping = 40;
      Checkout_ForOneItem.totalPrice = Checkout_ForOneItem.totalPrice + Checkout_ForOneItem.shipping;
    } else Checkout_ForOneItem.shipping = 0;
    this.Checkout_Payments = [Checkout_ForOneItem];
  }

  PAY() {
    this.isSubmited = true;
    if (this.frmShipment.valid) { //Delivery address:
      this.frmShipment.value._id = this.user[0]._id
      this.frmShipment.value.first_name = this.user[0].first_name;
      this.frmShipment.value.second_name = this.user[0].second_name;
      this.frmShipment.value.email = this.user[0].email;
      this.frmShipment.value.state = this.user[0].state;
      // --------------------------------------------------------------------------!!!!!!!!!!!!! do payment! & save order to DB
      let order = {
        order: this.order,
        payments: this.Checkout_Payments[0],
        shipping_details: this.frmShipment.value
      }

      // console.log(order);
      this.order_service.createOrder(order, this.languege)
      this.do_checkout = false;
    }
  }
  goToBill() { }
}