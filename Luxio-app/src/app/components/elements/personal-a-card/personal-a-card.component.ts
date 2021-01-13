import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  constructor(
    private language_Service: LanguageService,
    private shop_service: ShopService,
    private user_service: UserService,
    private order_service: OrderService
  ) { }

  public languege: string;
  public personalArea_products: Array<any> = [];
  public what_to_show: string;
  public message: string;
  public TOTAL_PRICE: number = 0;
  public discount: number = 0;
  public shipping: number = 40;
  public do_checkout: boolean = false;
  private user: Array<any>;
  public ashdod: boolean = false;
  public yirka: boolean = false;
  public isSubmitted: boolean;

  private infoTemplate = new FormGroup({
    _id: new FormControl('', Validators.required),
    first_name: new FormControl('', Validators.required),
    second_name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phoneN: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    zip: new FormControl(null),
    home: new FormControl('', Validators.required),
    apartment: new FormControl(''),
  });

  private cardTemplate = new FormGroup({
    cardNumber: new FormControl('', Validators.required),
    expirationDate: new FormControl('', Validators.required),
    securityCode: new FormControl('', Validators.required),
    cardHolderName: new FormControl('', Validators.required),
  });

  private payPalTemplate = new FormGroup({
    PayPalemail: new FormControl('', Validators.required),
    PayPalPassword: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.language_Service._selected_from_service
      .subscribe(date => { this.languege = date });

    this.user_service.user_to_show_from_service
      .subscribe(date => {
        this.what_to_show = date;
        if (this.what_to_show === 'cart') {
          this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_ct'));
          this.getTotalPrice();
        }
        else if (this.what_to_show === 'wishlist') {
          this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_f'));
        }
        else this.personalArea_products = null;
      });

    this.user_service.getUser(localStorage.getItem('u324_3i_25d'), this.languege);
    this.user_service.user_full_from_service
      .subscribe(date => this.user = date);
  }


  getTotalPrice() {
    this.TOTAL_PRICE = 0;
    this.discount = 0;
    if (this.personalArea_products) {
      this.personalArea_products.forEach(element => {
        console.log(element.total_price, element)
        this.TOTAL_PRICE = this.TOTAL_PRICE + element.total_price;
      });

      let x = 0;
      this.personalArea_products.forEach(element => {
        if (element.price === 117 || element.price === 112) {
          x = x + element.quantity;
        }
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

  pay_onlyThis(item) {
    console.log(item);
  }

  add_toCart(item) {
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

  remove_fromWishlist(item) {
    this.user_service.saveToFavorites(item);

    setTimeout(() => {
      this.personalArea_products = JSON.parse(localStorage.getItem('my_764528_f'));
    }, 1000);
  }

  cityCheck(city) {
    if (city === 'Center of Israel (close to Ashdod)') {
      this.ashdod = true;
    } else if (city === 'North of Israel (close to Nahariyya)') {
      this.yirka = true;
    } else {
      this.ashdod = false;
      this.yirka = false;
    }
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
    this.shop_service.selectProd(index, true); //sending index to server and seting bog-image-component open(true)
  }

  goToBill() {
    this.infoTemplate.setValue({
      _id: this.user[0]._id || '',
      first_name: this.user[0].first_name || '',
      second_name: this.user[0].second_name || '',
      email: this.user[0].email || '',
      phoneN: this.user[0].phoneN || '',
      city: this.user[0].city || '',
      state: this.user[0].state || '',
      street: this.user[0].street || '',
      zip: this.user[0].zip || null,
      home: this.user[0].home || '',
      apartment: this.user[0].apartment || ''
    });
    // ---------------
    this.do_checkout = !this.do_checkout;
  }

  closeCheckoutForm() {
    this.do_checkout = !this.do_checkout;
  }

  openPayment(paimentType) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(paimentType).style.display = "block";
  }

  get formControls() {
    return this.infoTemplate['controls'];
  }

  get formControlsCard() {
    return this.cardTemplate['controls'];
  }

  get formControlsPayPal() {
    return this.payPalTemplate['controls'];
  }

  goPay(paiment_type) {
    this.isSubmitted = true;
    if (this.infoTemplate.valid && this.cardTemplate.valid) {
      let order = {
        order: this.personalArea_products,
        payments: {
          shipping: this.shipping,
          discount: this.discount,
          total: this.TOTAL_PRICE,
          paiment_type: paiment_type
        },
        shipping_details: this.infoTemplate.value
      }
      this.order_service.createOrder(order, this.languege)
      // close checkout and empty cart
      this.personalArea_products = [];
      this.do_checkout = false;
    }
    else if (this.infoTemplate.valid && this.payPalTemplate.valid) {
      let order = {
        order: this.personalArea_products,
        payments: {
          shipping: this.shipping,
          discount: this.discount,
          total: this.TOTAL_PRICE,
          paiment_type: paiment_type
        },
        shipping_details: this.infoTemplate.value
      }
      this.order_service.createOrder(order, this.languege)
      // close checkout and empty cart
      this.personalArea_products = [];
      this.do_checkout = false;
    }

  }
}
