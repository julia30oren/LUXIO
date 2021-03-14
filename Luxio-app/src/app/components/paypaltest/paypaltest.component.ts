import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { OrderService } from 'src/app/services/order/order.service';
import { PaypalService } from 'src/app/services/paypal/paypal.service';

declare var paypal;

@Component({
  selector: 'app-paypaltest',
  templateUrl: './paypaltest.component.html',
  styleUrls: ['./paypaltest.component.css']
})
export class PaypaltestComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  public languege: string;
  public product = {
    price: null,
    description: ''
  }
  public fullOrder: object;
  public paidFor: boolean = false;
  public canceled: boolean = false;
  public cleanCart: boolean = false;
  public resPayPal: string;

  constructor(
    private language_Service: LanguageService,
    private paypal_service: PaypalService,
    private order_service: OrderService
  ) { }

  ngOnInit() {
    this.paypal_service.paypal_orderDetails_fromService
      .subscribe(date => {
        // console.log(date);
        // 0:
        // discount: 0
        // item: "Luxio CASHMERE x2"
        // price: 234
        // shipping: 40
        // totalPrice: 274
        if (date[0]) {
          this.product.price = date[0].totalPrice;
          this.product.description = date[0].item;
          if (date[0].allCart) {
            this.cleanCart = true;
          } else this.cleanCart = false;
        }
      });
    this.paypal_service.fullorderDetails_fromService
      .subscribe(date => { this.fullOrder = date; });
    this.language_Service._selected_from_service
      .subscribe(date => { this.languege = date });
    // --------------PAYPAL DUTTONS
    paypal
      .Buttons({
        createOrder: (date, action) => {
          console.log(date);
          return action.order.create({
            purchase_units: [
              {
                description: 'Luxio products : ' + this.product.description,
                amount: {
                  value: this.product.price
                }
              }
            ]
          });
        },
        onApprove: async (date, actions) => {
          const order = await actions.order.capture();
          switch (this.languege) {
            case 'en':
              this.resPayPal = 'The order was placed successfully!';
              break;
            case 'ru':
              this.resPayPal = 'Заказ был размещен успешно!';
              break;
            default:
              this.resPayPal = 'ההזמנה בוצעה בהצלחה!';
              break;
          }
          this.paidFor = true;
          this.fullOrder['payments']['orderID'] = date.orderID;
          this.fullOrder['payments']['payerID'] = date.payerID;
          this.order_service.createOrder(this.fullOrder, this.languege);
          this.endPayment();
        },
        onCancel: function (data) {
          // Show this and return to cart
          switch (this.languege) {
            case 'en':
              this.resPayPal = 'Order was canceled.';
              break;
            case 'ru':
              this.resPayPal = 'Заказ был отменен.';
              break;
            default:
              this.resPayPal = 'ההזמנה בוטלה.';
              break;
          }
          this.canceled = true;
        },
        onError: err => {
          console.log(err);
          // Show this
          switch (this.languege) {
            case 'en':
              this.resPayPal = 'Something went wrong. Please try again later.';
              break;
            case 'ru':
              this.resPayPal = 'Что-то пошло не так. Пожалуйста попробуйте ещё раз позже.';
              break;
            default:
              this.resPayPal = 'משהו השתבש. בבקשה נסה שוב מאוחר יותר.';
              break;
          }
          this.canceled = true;
        }
      })
      .render(this.paypalElement.nativeElement);

  }

  endPayment() {
    localStorage.removeItem('my_764528_ct');
    setTimeout(() => {
      this.paypal_service.endCheckout();
      window.location.reload();
    }, 1500)
  }
}
