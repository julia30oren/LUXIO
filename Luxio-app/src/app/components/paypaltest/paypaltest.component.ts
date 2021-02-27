import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var paypal;

@Component({
  selector: 'app-paypaltest',
  templateUrl: './paypaltest.component.html',
  styleUrls: ['./paypaltest.component.css']
})
export class PaypaltestComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  product = {
    price: 0.1,
    description: 'dkjhfvvkjvhb ljghr rogi h htg jh.',
    img: 'https://i.pinimg.com/564x/0b/a5/46/0ba546aa5bc2c1122001e946a5fc741b.jpg'
  }
  paidFor = false;

  constructor() { }

  ngOnInit() {
    paypal
      .Buttons({
        createOrder: (date, action) => {
          return action.order.create({
            purchase_units: [
              {
                description: this.product.description,
                amount: {
                  currency_code: 'ILS',
                  value: this.product.price
                }
              },
              {
                description: this.product.description,
                amount: {
                  currency_code: 'ILS',
                  value: this.product.price
                }
              }
            ]
          });
        },
        onApprove: async (date, actions) => {
          const order = await actions.order.capture();
          this.paidFor = true;
          console.log(order);
        },
        onError: err => {
          console.log(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }

}
