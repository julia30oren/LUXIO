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

  private user_full = new BehaviorSubject<Array<any>>([]);
  public user_full_from_service = this.user_full.asObservable();

  private user_name = new BehaviorSubject<string>(localStorage.getItem('u324_n4325e') ? localStorage.getItem('u324_n4325e') : '');
  public user_name_from_service = this.user_name.asObservable();

  private cart = new BehaviorSubject<Array<any>>([]);
  public cart_from_service = this.cart.asObservable();

  private user_to_show = new BehaviorSubject<string>('cart');
  public user_to_show_from_service = this.user_to_show.asObservable();

  private comments = new BehaviorSubject<Array<any>>([]);
  public comments_from_service = this.comments.asObservable();

  private message_to_user = new BehaviorSubject<any>(null);
  public message_to_user_from_service = this.message_to_user.asObservable();

  constructor(
    private http: HttpClient,
    private register_service: RegistrationService,
    private shop_service: ShopService
  ) { }

  getUser(id) {
    return this.http.get(`${this.DB_url}/user/${id}`).subscribe(res => this.user_full.next([res]));
  }

  saveUserChanges_toDB(user_props: object) {
    console.log(user_props);
    return this.http.post(`${this.DB_url}/user/user-props`, user_props).subscribe(res => {
      console.log(res);
    })
  }

  userToLogin(params) {
    return this.http.post(`${this.DB_url}/register/user-login`, params).subscribe(res => {
      this.seveUser_onService(res)
    });
  }

  seveUser_onService(res) {
    this.user.next([res]);
    let thisUser = [];
    thisUser.push(res);
    if (thisUser[0].status) {
      // console.log(res);
      this.user_name.next(thisUser[0].first_name + ' ' + thisUser[0].second_name);
      localStorage.setItem('u324_3i_25d', thisUser[0]._id);
      localStorage.setItem('u324_n4325e', thisUser[0].first_name + ' ' + thisUser[0].second_name);

      localStorage.setItem('my_764528_f', JSON.stringify(thisUser[0].favorites) || JSON.stringify([]));
      this.shop_service.favorites(thisUser[0].favorites);
      localStorage.setItem('my_764528_ct', JSON.stringify(thisUser[0].cart) || JSON.stringify([]));
      this.shop_service.cart(thisUser[0].cart);

      this.register_service.close_RegistrationForm();
    }
  }

  saveToFavorites(newToFavorites: object) {
    let localWishlist = JSON.parse(localStorage.getItem('my_764528_f'));

    if (localWishlist.length < 1) {
      localWishlist.push(newToFavorites);
      localStorage.setItem('my_764528_f', JSON.stringify(localWishlist));
      this.saveWishlist_toDB(localWishlist);

    } else {
      let itemAr = [];
      itemAr.push(newToFavorites);

      var index = localWishlist.findIndex(x => x._id === itemAr[0]._id);

      if (index === -1) {
        localWishlist.push(newToFavorites);
        localStorage.setItem('my_764528_f', JSON.stringify(localWishlist));
        this.saveWishlist_toDB(localWishlist);
      }
      else {
        localWishlist.splice(index, 1);
        localStorage.setItem('my_764528_f', JSON.stringify(localWishlist));
        this.saveWishlist_toDB(localWishlist);
      }
    }
  }

  saveWishlist_toDB(newWishlist: Array<any>) {
    let userLog = localStorage.getItem('u324_3i_25d');
    let toSend = { _id: userLog, favorites: newWishlist };

    this.shop_service.favorites(newWishlist);

    return this.http.post(`${this.DB_url}/user/new-favorites`, toSend)
      .subscribe(res => { console.log(res) });
  }

  saveToCart(newToCart: object) {
    let localCart = JSON.parse(localStorage.getItem('my_764528_ct'));

    if (localCart.length < 1) {
      localCart.push(newToCart);
      localStorage.setItem('my_764528_ct', JSON.stringify(localCart));
      this.saveCart_toDB(localCart);

    } else {
      let itemAr = [];
      itemAr.push(newToCart);

      var index = localCart.findIndex(x => x._id === itemAr[0]._id);

      if (index === -1) {
        localCart.push(newToCart);
        localStorage.setItem('my_764528_ct', JSON.stringify(localCart));
        this.saveCart_toDB(localCart);
      }
      else {
        localCart.splice(index, 1);
        localStorage.setItem('my_764528_ct', JSON.stringify(localCart));
        this.saveCart_toDB(localCart);
      }
    }
  }

  saveCart_toDB(newCart: Array<any>) {
    let userLog = localStorage.getItem('u324_3i_25d');
    let toSend = { _id: userLog, cart: newCart };

    this.shop_service.cart(newCart);

    return this.http.post(`${this.DB_url}/user/new-cart`, toSend)
      .subscribe(res => { console.log(res) });
  }

  set_showForUser(anyState: string) {
    this.user_to_show.next(anyState);
  }

  leaveAcomment(comment: object) {
    return this.http.post(`${this.DB_url}/comments/save`, comment)
      .subscribe(res => { console.log(res) });
  }


  // ------------------------------------------------------------------------- GET COMMENTS ------------------------------
  getAllComments() {
    return this.http.get(`${this.DB_url}/comments/get`)
      .subscribe(res => {
        // ------------------------------------------------- saving responce on service----
        this.comments.next([res]);
      });
  }


  // ------------------------------------------------------------------------- USER CHANGING PASSWORD ------------------------------
  saveNewPassword(email: string, new_pass: object) {
    return this.http.post(`${this.DB_url}/user/${email}/new-password`, new_pass)
      .subscribe(res => {
        // --------------------------------------------------------------------- MESSAGE TO USER ------------------
        this.message_to_user.next(res);
      });
  };

  // ------------------------------------------------------------------------- CLEAN MESSAGE TO USER ------------------------------
  cleanMessage_toUser() {
    this.message_to_user.next(null);
  };

}