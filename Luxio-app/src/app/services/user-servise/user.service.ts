import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RegistrationService } from '../registation/registration.service';
import { ShopService } from '../shop/shop.service';
import { RespondService } from '../respond/respond.service';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user_URL: string = `${environment.hostURL}:${environment.DBport}/user`;
  private comment_URL: string = `${environment.hostURL}:${environment.DBport}/comments`;
  private admin_url: string = `${environment.hostURL}:${environment.DBport}/admin`;

  private asAdmin = new BehaviorSubject<boolean>(false);
  public asAdmin_from_service = this.asAdmin.asObservable();

  private user = new BehaviorSubject<Array<any>>([]);
  public user_from_service = this.user.asObservable();

  private users = new BehaviorSubject<Array<any>>([]);
  public users_from_service = this.users.asObservable();

  private user_full = new BehaviorSubject<Array<any>>([]);
  public user_full_from_service = this.user_full.asObservable();

  private user_name = new BehaviorSubject<string>(localStorage.getItem('u324_n4325e') ? localStorage.getItem('u324_n4325e') : localStorage.getItem('ad34_n746773e'));
  public user_name_from_service = this.user_name.asObservable();

  private user_to_show = new BehaviorSubject<string>('cart');
  public user_to_show_from_service = this.user_to_show.asObservable();

  private comments = new BehaviorSubject<Array<any>>([]);
  public comments_from_service = this.comments.asObservable();


  constructor(
    private http: HttpClient,
    private respond_Service: RespondService,
    private register_Service: RegistrationService,
    private shop_Service: ShopService
  ) { }
  // ---------------------------------------------------CART
  // ----------------------------------------------------------------------- ADD ITEM TO CART --------------------
  saveItemToCart(item: object, languege: string) {
    let userID = localStorage.getItem('u324_3i_25d'); //check if user loged in
    if (userID) {
      let toDB = { _id: userID, item: item };
      return this.http.post(`${this.user_URL}/${languege}/addtocart`, toDB)
        .subscribe(res => {
          if (res[0].status) {
            localStorage.setItem('my_764528_ct', JSON.stringify(res[0].newCart)); // save new cart to localStorage
            this.shop_Service.cart(res[0].newCart); //save new cart on service
          } else this.respond_Service.saveRespond(res); // if failed -> send negative response to user
        });
    } else {
      let cart = JSON.parse(localStorage.getItem('my_764528_ct'));
      cart ? cart.push(item) : cart = [item];
      localStorage.setItem('my_764528_ct', JSON.stringify(cart)); // save new cart to localStorage
      this.shop_Service.cart(cart); //save new cart on service
    }
  }
  // ----------------------------------------------------------------------- REMOVE ITEM FROM CART --------------------
  deleteItemFromCart(item_id: string, languege: string) {
    let userID = localStorage.getItem('u324_3i_25d'); //check if user loged in
    if (userID) {
      let toDB = { _id: userID, item_id: item_id };
      return this.http.post(`${this.user_URL}/${languege}/deletefromcart`, toDB)
        .subscribe(res => {
          // console.log(res)
          if (res[0].status) {
            localStorage.setItem('my_764528_ct', JSON.stringify(res[0].newCart)); // save new cart to localStorage
            this.shop_Service.cart(res[0].newCart); //save new cart on service
          } else this.respond_Service.saveRespond(res); // if failed -> send negative response to user
        });
    } else {
      let cart = JSON.parse(localStorage.getItem('my_764528_ct')); // []
      var removeIndex = cart.map(function (item) { return item.id; }).indexOf(item_id);
      cart.splice(removeIndex, 1); // remove item from cart
      localStorage.setItem('my_764528_ct', JSON.stringify(cart)); // save new cart to localStorage
      this.shop_Service.cart(cart); //save new cart on service
    }
  }
  // ---------------------------------------------------FAVORITES
  // ----------------------------------------------------------------------- ADD ITEM TO FAVORITES --------------------
  saveItemToFavorites(item: object, languege: string) {
    let userID = localStorage.getItem('u324_3i_25d'); //check if user loged in
    if (userID) {
      let toDB = { _id: userID, item: item };
      return this.http.post(`${this.user_URL}/${languege}/addtofavorites`, toDB)
        .subscribe(res => {
          console.log(res);
          if (res[0].status) {
            localStorage.setItem('my_764528_f', JSON.stringify(res[0].newFavorites)); // save new favorites to localStorage
            this.shop_Service.favorites(res[0].newFavorites); //save new cart on service
          } else this.respond_Service.saveRespond(res); // if failed -> send negative response to user
        });
    } else {
      let favorites = JSON.parse(localStorage.getItem('my_764528_f')); // []
      favorites ? favorites.push(item) : favorites = [item];
      localStorage.setItem('my_764528_f', JSON.stringify(favorites)); // save new favorites to localStorage
      this.shop_Service.favorites(favorites); //save new cart on service
    }
  }
  // --------------------------------------------------
  deleteItemFromFavorites(item_id: string, languege: string) {
    let userID = localStorage.getItem('u324_3i_25d'); //check if user loged in
    if (userID) {
      let toDB = { _id: userID, item_id: item_id };
      return this.http.post(`${this.user_URL}/${languege}/deletefromfavorites`, toDB)
        .subscribe(res => {
          if (res[0].status) {
            localStorage.setItem('my_764528_f', JSON.stringify(res[0].newFavorites)); // save new favotites to localStorage
            this.shop_Service.favorites(res[0].newFavorites); //save new favorites on service
          } else this.respond_Service.saveRespond(res); // if failed -> send negative response to user
        });
    } else {
      let favorites = JSON.parse(localStorage.getItem('my_764528_f')); // []
      var removeIndex = favorites.map(function (item) { return item.id; }).indexOf(item_id);
      favorites.splice(removeIndex, 1); // remove item from cart
      localStorage.setItem('my_764528_f', JSON.stringify(favorites)); // save new cart to localStorage
      this.shop_Service.favorites(favorites); //save new favorites on service
    }
  }
  // -----------------------------get all users-------------------
  adminTokenCheck(token: any) {
    return this.http.get(`${this.admin_url}/check/${token}`).subscribe(res => {
      if (res && res[0].status) {
        this.asAdmin.next(true);
      } else {
        localStorage.clear();
        this.asAdmin.next(false);
        this.user_name.next(null);
        window.location.reload();
      }
    });
  }

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
  userToLogin(params: object, languege: string) {
    return this.http.post(`${this.user_URL}/${languege}/login`, params).subscribe(res => {

      if (res[0].message === 'admin' && res[0].status) {// if admin
        this.asAdmin.next(true);
      } else { //if user
        this.respond_Service.saveRespond(res);
        if (res[0].status) {
          this.seveUser_onService(res);
          this.register_Service.close_RegistrationForm();
        }
      }
    });
  }
  // -----------------LOG IN AS ADMIN------------------
  logInadmin(params: object, languege: string) {
    return this.http.post(`${this.admin_url}/${languege}/login`, params).subscribe(res => {
      this.respond_Service.saveRespond(res);
      this.register_Service.close_RegistrationForm();
      if (res[0].status) {
        localStorage.clear();
        this.seveAdmin_onService(res);
        this.register_Service.userAsAdmin(true);
        window.location.reload();
      } else this.register_Service.userAsAdmin(false);
    });
  }
  // -----------------------
  denyAdminEntrance() {
    this.asAdmin.next(false);
  }
  // ---------------save admin on lochal host
  seveAdmin_onService(adminInfo) {
    //status: true, message: responseMessage, token: adminToken, admin: adminName
    // geting user and token:
    let admin = adminInfo[0].admin;
    let token = adminInfo[0].token;
    this.user_name.next(admin);// saving admin name on serner
    // saving users info to localStorage
    localStorage.setItem('ad34_n746773e', admin);
    localStorage.setItem('token', token);

    this.register_Service.close_RegistrationForm();   // closing log-in form
    this.denyAdminEntrance();
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
        this.respond_Service.saveRespond(res);
      });
  };

  // -----------------------------------------------SAVING NEW WISHLIST----------------------
  saveWishlist_toDB(newWishlist: Array<any>, lang: string) {
    let userLog = localStorage.getItem('u324_3i_25d'); //geting users id
    let toSend = { _id: userLog, favorites: newWishlist };
    // ----------------------------------------saving new favorites to service----------------
    this.shop_Service.favorites(newWishlist);
    // -----------------------------------------saving new favorites to DB----------------
    return this.http.post(`${this.user_URL}/${lang}/new-favorites`, toSend)
      .subscribe(date => this.respond_Service.saveRespond(date));
  }


  // ---------------------------------------------------COMMENTS----------------------------
  // ---------------------------------------------------- GET COMMENTS ------------------------------
  getAllComments() {
    return this.http.get(`${this.comment_URL}`).subscribe(res => {
      let comments = res[0].allComments;
      if (comments) {
        this.saveCommentsOnService(comments);
      } else console.error('no comments came from server');
    });
  }

  saveCommentsOnService(comments) {
    this.comments.next([comments]);
  }

  // ---------------------------------------------------- LEAVE COMMENT ------------------------------
  leaveAcomment(comment: object, languege: string) {
    return this.http.post(`${this.comment_URL}/${languege}/save`, comment)
      .subscribe(res => {
        this.respond_Service.saveRespond(res);
      });
  }

  // --------------------------------------------------------------------------------FUNCTIONS-----------------
  // ----to save user on service----------
  seveUser_onService(userFullInfo) {
    let cookieAgree = JSON.parse(localStorage.getItem('cookies_rep_hash'));
    localStorage.clear();
    localStorage.setItem('cookies_rep_hash', JSON.stringify(cookieAgree));
    // geting user and token:
    let user = userFullInfo[0].user;
    let token = userFullInfo[0].token;
    this.user.next([user]); //saving user on server
    this.user_name.next(user.first_name + ' ' + user.second_name);// saving user name on serner
    // saving users info to localStorage
    localStorage.setItem('u324_3i_25d', user._id);
    localStorage.setItem('u324_n4325e', user.first_name + ' ' + user.second_name);
    localStorage.setItem('token', token);
    user.favorites ? localStorage.setItem('my_764528_f', JSON.stringify(user.favorites)) : localStorage.setItem('my_764528_f', JSON.stringify([]));
    user.cart ? localStorage.setItem('my_764528_ct', JSON.stringify(user.cart)) : localStorage.setItem('my_764528_ct', JSON.stringify([]));
    user.specialSet ? localStorage.setItem('special_set', JSON.stringify(user.specialSet)) : localStorage.setItem('special_set', JSON.stringify([]));
  }

  // ---------------------------------------------------special order-----
  saveSpecialSet_toDB(user_id: string, set_id: string, specialSet: Array<any>, lang: string) {
    return this.http.post(`${this.user_URL}/${lang}/newspecial`, { _id: user_id, set_id: set_id, newSet: specialSet })
      .subscribe(date => {
        this.respond_Service.saveRespond(date)
        let res = date[0];
        if (res.status) {
          this.saveNewSet_localy(res.newSet);
          // ----------------------------------------saving new special set to service----------------
          this.shop_Service.special(res.newSet);
        }
      });
  }

  saveNewSet_localy(newSet) {
    localStorage.removeItem('special_set');
    localStorage.setItem('special_set', JSON.stringify(newSet))
  }

  deleteSpecialSet_fromDB(user_id: string, set_id: string) {
    return this.http.post(`${this.user_URL}/deletespecial`, { _id: user_id, set_id: set_id })
      .subscribe(date => {
        this.respond_Service.saveRespond(date)
        let res = date[0];
        if (res.status) {
          this.saveNewSet_localy(res.newSet);
          // ----------------------------------------saving new special set to service----------------
          this.shop_Service.special(res.newSet);
        }
      });
  }

  // ----------------------------------------------
  set_showForUser(anyState: string) {
    this.user_to_show.next(anyState);
  }

}