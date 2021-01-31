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

  private cart = new BehaviorSubject<Array<any>>([]);
  public cart_from_service = this.cart.asObservable();

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
          // localStorage.clear();
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
  saveWishlist_toDB(newWishlist: Array<any>) {
    let userLog = localStorage.getItem('u324_3i_25d'); //geting users id
    let toSend = { _id: userLog, favorites: newWishlist };
    // ----------------------------------------saving new favorites to service----------------
    this.shop_Service.favorites(newWishlist);
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
    this.shop_Service.cart(newCart);
    // -----save on localStorage
    localStorage.setItem('my_764528_ct', JSON.stringify(newCart));
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
  seveUser_onService(userFullInfo) {
    // geting user and token:
    let user = userFullInfo[0].user;
    let token = userFullInfo[0].token;
    this.user.next([user]); //saving user on server
    this.user_name.next(user.first_name + ' ' + user.second_name);// saving user name on serner
    // saving users info to localStorage
    localStorage.setItem('u324_3i_25d', user._id);
    localStorage.setItem('u324_n4325e', user.first_name + ' ' + user.second_name);
    localStorage.setItem('token', token);

    user.favorites.forEach(element => {
      this.usersFavorites(element); // to mix favorites from DB and from localStorage
    });

    user.cart.forEach(element => {
      this.usersCart(element); // to mix cart from DB and from localStorage
    });

    this.register_Service.close_RegistrationForm();   // closing log-in form
  }


  // ----------------------------------------------------NEW WISHLIST---------
  saveToFavorites(newToFavorites: object) {
    // ----geting wishlist from localStorage
    let localWishlist = JSON.parse(localStorage.getItem('my_764528_f')) || [];

    if (localWishlist.length < 1) { //---------if wishlist is EMPTY:
      localWishlist.push(newToFavorites);
    } else { //-------------------------------if wishlist NOT EMPTY:
      // ------------remove from favorites or add:
      let itemAr = [];// creating temporary array
      itemAr.push(newToFavorites);
      var index = localWishlist.findIndex(x => x._id === itemAr[0]._id);// find index of item

      if (index === -1) { //if item don't exist in wishlist:
        localWishlist.push(newToFavorites);  // add item
      } else localWishlist.splice(index, 1); // delete item

    }

    setTimeout(() => {
      this.saveWishlist_toDB(localWishlist);  // save new wishlist to DB
      localStorage.setItem('my_764528_f', JSON.stringify(localWishlist));  // save new wishlist to localStorage
    }, 1000);
  }
  // ---------------------------after user logd in
  usersFavorites(newToFavorites) {
    // ----geting wishlist from localStorage
    let localWishlist = JSON.parse(localStorage.getItem('my_764528_f')) || [];

    if (localWishlist.length < 1) { //---------if wishlist is EMPTY:
      localWishlist.push(newToFavorites);
    } else { //-------------------------------if wishlist NOT EMPTY:
      // ------------ add:
      let itemAr = [];// creating temporary array
      itemAr.push(newToFavorites);
      var index = localWishlist.findIndex(x => x._id === itemAr[0]._id);// find index of item
      if (index === -1) {
        localWishlist.push(newToFavorites);  // add item
      } else return;
    }

    setTimeout(() => {
      this.saveWishlist_toDB(localWishlist);  // save new wishlist to DB
      localStorage.setItem('my_764528_f', JSON.stringify(localWishlist));  // save new wishlist to localStorage
    }, 1000);
  }


  // ----------------------------------------------------NEW CART---------
  saveToCart(newToCart: object) {
    // ----geting cart from localStorage
    let localCart = JSON.parse(localStorage.getItem('my_764528_ct')) || [];

    if (localCart.length < 1) { //---------if cart is EMPTY:
      localCart.push(newToCart);
    } else { //-------------------------------if cart NOT EMPTY:
      let itemAr = []; // creating temporary array
      itemAr.push(newToCart);
      var index = localCart.findIndex(x => x._id === itemAr[0]._id); // find index of item

      if (index === -1) {
        localCart.push(newToCart); // add item
      } else localCart.splice(index, 1); // remove item
    }

    setTimeout(() => {
      this.saveCart_toDB(localCart);  // save new cart to DB
      localStorage.setItem('my_764528_ct', JSON.stringify(localCart));  // save new cart to localStorage
    }, 1000);
  }
  // ---------------------------after user loged in
  usersCart(newToCart) {
    // ----geting cart from localStorage
    let localCart = JSON.parse(localStorage.getItem('my_764528_ct')) || [];

    if (localCart.length < 1) { //---------if cart is EMPTY:
      localCart.push(newToCart);
    } else { //-------------------------------if cart NOT EMPTY:
      // ------------ add:
      let itemAr = [];// creating temporary array
      itemAr.push(newToCart);
      var index = localCart.findIndex(x => x._id === itemAr[0]._id);// find index of item
      if (index === -1) {
        localCart.push(newToCart);  // add item
      } else return;
    }

    setTimeout(() => {
      this.saveCart_toDB(localCart);  // save new cart to DB
      localStorage.setItem('my_764528_ct', JSON.stringify(localCart));  // save new cart to localStorage
    }, 1000);
  }

  // ----------------------------------------------
  set_showForUser(anyState: string) {
    this.user_to_show.next(anyState);
  }

}