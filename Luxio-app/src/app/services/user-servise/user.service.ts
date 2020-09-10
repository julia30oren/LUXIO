import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RegistrationService } from '../registation/registration.service';
import { ShopService } from '../shop/shop.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private DB_url: string = 'http://localhost:5000';

  private user = new BehaviorSubject<Array<any>>([]);
  public user_from_service = this.user.asObservable();

  private user_name = new BehaviorSubject<string>(localStorage.getItem('u324_n4325e') ? localStorage.getItem('u324_n4325e') : '');
  public user_name_from_service = this.user_name.asObservable();

  private cart = new BehaviorSubject<Array<any>>([]);
  public cart_from_service = this.cart.asObservable();

  constructor(
    private http: HttpClient,
    private register_service: RegistrationService,
    private shop_service: ShopService
  ) { }

  userToLogin(params) {
    return this.http.post(`${this.DB_url}/register/user-login`, params).subscribe(res => {
      this.user.next([res]);
      let thisUser = [];
      thisUser.push(res);
      if (thisUser[0].status) {
        console.log(res);
        this.user_name.next(thisUser[0].first_name + ' ' + thisUser[0].second_name);
        localStorage.setItem('u324_3i_25d', thisUser[0]._id);

        localStorage.setItem('u324_n4325e', thisUser[0].first_name + ' ' + thisUser[0].second_name);
        localStorage.setItem('my_764528_f', thisUser[0].favorites || []);
        this.shop_service.favorites(thisUser[0].favorites);
        localStorage.setItem('my_764528_ct', thisUser[0].cart || []);
        this.shop_service.cart(thisUser[0].cart);
        this.register_service.close_RegistrationForm();
      }
    });
  }

  saveToFavorites(newFavorites: Array<any>) {
    let toSend = { _id: localStorage.getItem('u324_3i_25d'), favorites: newFavorites };
    return this.http.post(`${this.DB_url}/user/new-favorites`, toSend)
      .subscribe(res => { console.log(res) });
  }

  saveToCart(newCart: Array<any>) {
    let toSend = { _id: localStorage.getItem('u324_3i_25d'), favorites: newCart };
    return this.http.post(`${this.DB_url}/user/new-cart`, toSend)
      .subscribe(res => { console.log(res) });
  }
}
