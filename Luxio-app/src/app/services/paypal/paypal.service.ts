import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private paypal_orderDetails = new BehaviorSubject<Array<any>>([]);
  public paypal_orderDetails_fromService = this.paypal_orderDetails.asObservable();

  // do_checkout
  private NEWcheckout = new BehaviorSubject<boolean>(true);
  public NEWcheckout_fromService = this.NEWcheckout.asObservable();

  private checkoutState = new BehaviorSubject<boolean>(false);
  public checkoutState_fromService = this.checkoutState.asObservable();

  constructor() { }

  plaseOrderDetails(orderDetails: Array<any>) {
    this.paypal_orderDetails.next(orderDetails);
  }

  // ---------------------------------------

  changeCheckoutState(st: boolean) {
    this.checkoutState.next(st);
  }

  endCheckout() {
    this.checkoutState.next(false);
    this.NEWcheckout.next(true);
  }

  doCheckout() {
    this.NEWcheckout.next(false);
  }
}