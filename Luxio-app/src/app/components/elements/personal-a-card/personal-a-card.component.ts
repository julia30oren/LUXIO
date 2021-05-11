import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';
import { UserService } from 'src/app/services/user-servise/user.service';
import { PaypalService } from 'src/app/services/paypal/paypal.service';

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
    private paypal_service: PaypalService
  ) { this.frmShipment = this.createSignupForm(); }

  public languege: string;
  public user: Array<any>;
  public userAuthorized: boolean;
  public what_to_show: string;

  public allProd: Array<any>;
  public personalArea_products: Array<any>;
  public specialOrder: Array<any>;

  public TOTAL_PRICE: number = 0;
  public shipping: number = 0;
  public orderToPay: Array<any>; //final order from "cart"and"special" / item / spesial

  public do_checkout: boolean;
  public isSubmited: boolean;
  public paypalButtonsDisabled: boolean = true;

  ngOnInit() {
    this.language_Service._selected_from_service
      .subscribe(date => { this.languege = date });

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.allProd = date[0];
      });
    // ------------subscribe to special order from service------
    this.shop_service.my_special_from_service
      .subscribe(date => {
        this.specialOrder = date || null;
        this.getTotalPrice();
      });

    this.user_service.getUser(localStorage.getItem('u324_3i_25d'), this.languege);
    this.user_service.user_full_from_service
      .subscribe(date => {
        this.user = date;
        if (this.user.length < 1) {
          this.userAuthorized = false;
        } else this.userAuthorized = true;
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

    this.paypal_service.NEWcheckout_fromService
      .subscribe(date => {
        if (date) {
          this.paypalButtonsDisabled = true;
        }
      })

    this.paypal_service.checkoutState_fromService
      .subscribe(date => this.do_checkout = date);
  }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        phoneN: ['', Validators.compose([Validators.required])],
        city: ['', Validators.compose([Validators.required])],
        street: ['', Validators.compose([Validators.required])],
        home: ['', Validators.compose([Validators.required])],
        apartment: [''],
        zip: [null]
      }
    );
  }
  // --------------------------------------open big
  select(id: number) {
    let index = this.personalArea_products.findIndex((element) => element.burcode_id === id); //geting index of item by id
    this.shop_service.selectProd(index, true); //sending index to server and seting big-image-component open(true)
  }
  // --------------------------------------------changing quantity of item in cart
  quantity_change(item, val) {
    this.personalArea_products.forEach(element => {
      if (element._id === item._id) {
        element.quantity = JSON.parse(val);
        element.total_price = element.quantity * element.price;
      }
    });
    this.user_service.saveCart_toDB(this.personalArea_products, this.languege);
    this.getTotalPrice();
  }
  // ----------------------------------------------
  amount_change(item, val) {
    let newValuse = JSON.parse(val);
    item.amount = newValuse.amount;
    item.price = JSON.parse(newValuse.price);
    item.total_price = item.quantity * item.price;
    this.user_service.saveToCart(item, this.languege);
    this.getTotalPrice();
  }
  // ------------------------------------get total price for all in cart
  getTotalPrice() {
    this.specialOrder ?
      this.TOTAL_PRICE = this.specialOrder.length * 585 :
      this.TOTAL_PRICE = 0;

    if (this.personalArea_products) {
      this.personalArea_products.forEach(element => {
        this.TOTAL_PRICE = this.TOTAL_PRICE + element.total_price;
      });
    }
    if (0 < this.TOTAL_PRICE && this.TOTAL_PRICE < 1000) {
      this.shipping = 40;
      this.TOTAL_PRICE = this.TOTAL_PRICE + this.shipping;
    } else this.shipping = 0;
  }
  // ------------------------------------add item from favorites to cart
  add_toCart(item_id) {
    this.allProd.forEach(element => {
      if (element._id === item_id) {
        element.amount = element.amount_1;
        element.price = element.price_1;
        element.quantity = 1;
        element.total_price = element.price_1;
        this.user_service.saveToCart(element, this.languege);
      }
    });
  }
  // -------------------------------------delete item from favorites
  remove_fromWishlist(item) {
    this.user_service.saveToFavorites(item, this.languege);
    setTimeout(() => {
      this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_f'));
    }, 1000);
  }
  // --------------------------------------delete set from cart
  deleteSet(setId) {
    this.user_service.deleteSpecialSet_fromDB(this.user[0]._id, setId);
  }
  // --------------------------------------delete item from cart
  delete_fromCart(item) {
    this.user_service.saveToCart(item, this.languege);
    setTimeout(() => {
      this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_ct'));
      this.getTotalPrice()
    }, 1000);
  }
  // -----------------------------------pay only for 1 item ore set
  pay_onlyThis(setOrItem: object) {
    let Checkout_ForOneItem = {
      allCart: false,
      description: '',
      order: setOrItem,
      price: 'set_price' in setOrItem[0] ? setOrItem[0].set_price : setOrItem[0].total_price,
      totalPrice: 0,
      shipping: 40
    };
    Checkout_ForOneItem.shipping = Checkout_ForOneItem.price < 1000 ? 40 : 0;
    Checkout_ForOneItem.totalPrice = Checkout_ForOneItem.price + Checkout_ForOneItem.shipping;

    if ('set_price' in setOrItem[0]) {
      Checkout_ForOneItem.description = 'Set (5+1): ';
      setOrItem[0].set.forEach(element => {
        Checkout_ForOneItem.description = Checkout_ForOneItem.description + element.prod_class + ' ' + element.name + ' x1 ; ';
      });
    } else {
      Checkout_ForOneItem.description = setOrItem[0].prod_class + ' ' + setOrItem[0].name + ' x' + setOrItem[0].quantity
    }

    this.orderToPay = [Checkout_ForOneItem];// saving final order
    this.paypal_service.changeCheckoutState(true);
  }

  closePaimentForm() {
    this.paypal_service.endCheckout();
  }

  goToBill() {
    let Checkout_ForAllCart = {
      allCart: true,
      order: [],
      description: '',
      price: this.TOTAL_PRICE - this.shipping,
      totalPrice: this.TOTAL_PRICE,
      shipping: this.shipping,
    };
    this.personalArea_products.forEach(element => {
      let name = element.prod_class + ' ' + element.name + ' (' + element.amount + ') x' + element.quantity;
      Checkout_ForAllCart.description = Checkout_ForAllCart.description + name + ' ; '
      Checkout_ForAllCart.order.push(element);
    });
    this.specialOrder.forEach(element => {
      element.name = 'Set (5+1): ';
      element.total_price = element.set_price;
      element.set.forEach(item => {
        element.name = element.name + item.prod_class + ' ' + item.name + ' x1 ; ';
      });
      Checkout_ForAllCart.description = Checkout_ForAllCart.description + ' ' + element.name;
      Checkout_ForAllCart.order.push(element);
    });

    this.orderToPay = [Checkout_ForAllCart];// saving final order
    this.paypal_service.changeCheckoutState(true);
  }

  checkAllDate() {
    this.isSubmited = true;
    if (this.frmShipment.valid) { //Delivery address:
      this.frmShipment.value._id = this.user[0]._id;
      this.frmShipment.value.first_name = this.user[0].first_name;
      this.frmShipment.value.second_name = this.user[0].second_name;
      this.frmShipment.value.email = this.user[0].email;
      this.frmShipment.value.state = this.user[0].state;
      // --------------------------------------------------------------------------!!!!!!!!!!!!! do payment! & save order to DB
      this.orderToPay[0].shipping_details = this.frmShipment.value;
      this.orderToPay[0].order_id = Math.floor(Math.random() * 9999) + '-order-' + Math.floor(Math.random() * 9999) + Math.floor(Math.random() * 9999);
      this.paypalButtonsDisabled = false;
      // --------------------------------ende of checkout = payment sent to DB and PayPal
      console.log(this.orderToPay);
      this.paypal_service.plaseOrderDetails(this.orderToPay);
    }
  }

}