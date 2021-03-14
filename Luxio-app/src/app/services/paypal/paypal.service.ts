import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  // do_checkout
  private NEWcheckout = new BehaviorSubject<boolean>(true);
  public NEWcheckout_fromService = this.NEWcheckout.asObservable();

  private checkoutState = new BehaviorSubject<boolean>(false);
  public checkoutState_fromService = this.checkoutState.asObservable();

  private paypal_orderDetails = new BehaviorSubject<Array<any>>([]);
  public paypal_orderDetails_fromService = this.paypal_orderDetails.asObservable();

  private fullorderDetails = new BehaviorSubject<object>({});
  public fullorderDetails_fromService = this.fullorderDetails.asObservable();

  constructor() { }
  doCheckout() {
    this.NEWcheckout.next(false);
  }

  plaseOrderDetails(orderDetails: Array<any>) {
    this.paypal_orderDetails.next(orderDetails);
  }

  plaseOrderDetails_forDB(order: object) {
    this.fullorderDetails.next(order);
  }

  changeCheckoutState(st: boolean) {
    this.checkoutState.next(st);
  }

  endCheckout() {
    this.checkoutState.next(false);
    this.NEWcheckout.next(true);
  }
}