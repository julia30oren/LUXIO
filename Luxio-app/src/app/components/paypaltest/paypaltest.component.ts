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
  public fullOrder: Array<any>;

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
    this.language_Service._selected_from_service//----------------language
      .subscribe(date => { this.languege = date; console.log(date) });

    this.paypal_service.paypal_orderDetails_fromService // subscribing for full order 
      .subscribe(date => {
        console.log("1 spep on paypal ", date);
        this.fullOrder = date;
        console.log("2 spep on paypal ", this.fullOrder);
      });

    // --------------PAYPAL DUTTONS
    paypal
      .Buttons({
        createOrder: (date, action) => {
          return action.order.create({
            purchase_units: [
              {
                description: this.fullOrder[0].description,
                amount: {
                  value: this.fullOrder[0].totalPrice
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
    // IF ORDER PAYED SACCSESSFULY:
    // NEED TO SEND ORDER TO DB
    // AND CLEAR CART ON localStorage


    // localStorage.setItem('my_764528_ct', '[]');
    // setTimeout(() => {
    this.paypal_service.endCheckout();
    //   window.location.reload();
    // }, 1500)
  }
}
