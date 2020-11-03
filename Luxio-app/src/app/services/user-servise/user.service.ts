import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RegistrationService } from '../registation/registration.service';
import { ShopService } from '../shop/shop.service';
import { TranslateService } from '@ngx-translate/core';
import { RespondService } from '../respond/respond.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user_URL: string = 'http://localhost:5000/user';
  private comment_URL: string = 'http://localhost:5000/comments'


  private user = new BehaviorSubject<Array<any>>([]);
  public user_from_service = this.user.asObservable();

  private users = new BehaviorSubject<Array<any>>([]);
  public users_from_service = this.users.asObservable();

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

  // private message_to_user = new BehaviorSubject<any>(null);
  // public message_to_user_from_service = this.message_to_user.asObservable();


  constructor(
    private http: HttpClient,
    private respond_Service: RespondService,
    private translate: TranslateService,
    private register_service: RegistrationService,
    private shop_service: ShopService
  ) { }


  // -----------------------------get all users-------------------
  getUsers_fromDB() {
    return this.http.get(`${this.user_URL}`).subscribe(res => {
      let users = res[0].allUsers;
      this.users.next(users)
    });

  }

  // ---------------get user by id------------
  getUser(id: string, languege: string) {
    return this.http.get(`${this.user_URL}/${languege}/${id}`).subscribe(res => {
      let userInfo = res[0].user;
      this.user_full.next([userInfo]);
    });
  }

  // ---------------LOG IN USER------------
  userToLogin(params) {
    // return this.http.post(`${this.user_URL}/${this.lang}/login`, params).subscribe(res => {
    //   console.log(res);
    //   // this.seveUser_onService(res);
    // });
  }

  // ---------------update user by id------------
  saveUserChanges_toDB(user_id: string, user_props: object, languege: string) {
    return this.http.post(`${this.user_URL}/${languege}/update/${user_id}`, user_props).subscribe(res => {
      this.respond_Service.saveRespond(res);
    })
  }

  // ------------------------------------------------------------------------- USER CHANGING PASSWORD ------------------------------
  saveNewPassword(email: string, new_pass: object, languege: string) {
    return this.http.post(`${this.user_URL}/${languege}/newpass/${email}`, new_pass)
      .subscribe(res => {
        console.log(res)
        this.respond_Service.saveRespond(res);
      });
  };

  // -----------------------------------------------SAVING NEW WISHLIST----------------------
  saveWishlist_toDB(newWishlist: Array<any>) {
    let userLog = localStorage.getItem('u324_3i_25d'); //geting users id
    let toSend = { _id: userLog, favorites: newWishlist };
    // ----------------------------------------saving new favorites to service----------------
    this.shop_service.favorites(newWishlist);
    // -----------------------------------------saving new favorites to DB----------------
    return this.http.post(`${this.user_URL}/new-favorites`, toSend)
      .subscribe(res => {
        console.log(res);
      });
  }

  // -----------------------------------------------SAVING NEW CART----------------------
  saveCart_toDB(newCart: Array<any>) {
    let userLog = localStorage.getItem('u324_3i_25d');
    let toSend = { _id: userLog, cart: newCart };
    // ----------------------------------------saving new cart to service----------------
    this.shop_service.cart(newCart);
    // -----------------------------------------saving new cart to DB----------------
    return this.http.post(`${this.user_URL}/new-cart`, toSend)
      .subscribe(res => {
        console.log(res);
      });
  }


  // ---------------------------------------------------COMMENTS----------------------------
  // ---------------------------------------------------- GET COMMENTS ------------------------------
  getAllComments() {
    return this.http.get(`${this.comment_URL}`).subscribe(res => {
      let comments = res[0].allComments;
      if (comments) {
        this.comments.next([comments]);
      } else console.error('no comments came from server');
    });
  }
  // ---------------------------------------------------- LEAVE COMMENT ------------------------------
  leaveAcomment(comment: object, languege: string) {
    return this.http.post(`${this.comment_URL}/${languege}/save`, comment)
      .subscribe(res => {
        this.respond_Service.saveRespond(res);
      });
  }
  // ---------------------------------------------------- DELETE COMMENT ------------------------------
  // no connected function----
  deleteAcomment(comment_id: string, languege: string) {
    return this.http.get(`${this.comment_URL}/${languege}/remove/${comment_id}`)
      .subscribe(res => {
        console.log(res);
      });
  }



  // --------------------------------------------------------------------------------FUNCTIONS-----------------
  // ----to save user on service----------
  seveUser_onService(user) {
    console.log(user);
    // this.user.next([res]);
    // let thisUser = [];
    // thisUser.push(res);
    // if (thisUser[0].status) {
    //   // console.log(res);
    //   this.user_name.next(thisUser[0].first_name + ' ' + thisUser[0].second_name);
    //   localStorage.setItem('u324_3i_25d', thisUser[0]._id);
    //   localStorage.setItem('u324_n4325e', thisUser[0].first_name + ' ' + thisUser[0].second_name);

    //   localStorage.setItem('my_764528_f', JSON.stringify(thisUser[0].favorites) || JSON.stringify([]));
    //   this.shop_service.favorites(thisUser[0].favorites);
    //   localStorage.setItem('my_764528_ct', JSON.stringify(thisUser[0].cart) || JSON.stringify([]));
    //   this.shop_service.cart(thisUser[0].cart);

    //   this.register_service.close_RegistrationForm();
    // }
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


  set_showForUser(anyState: string) {
    this.user_to_show.next(anyState);
  }


  // ------------------------------------------------------------------------- CLEAN MESSAGE TO USER ------------------------------
  // cleanMessage_toUser() {
  //   this.message_to_user.next(null);
  // };

}