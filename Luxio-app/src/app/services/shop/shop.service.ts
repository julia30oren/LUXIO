import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { RespondService } from '../respond/respond.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private prod_url: string = `${environment.hostURL}:${environment.DBport}/products`;
  // private prod_url: string = `http://167.172.166.141:5001/products`;


  private shop_products = new BehaviorSubject<Array<any>>([]);
  public shop_products_from_service = this.shop_products.asObservable();

  private shop_products_sorted = new BehaviorSubject<Array<any>>([]);
  public shop_products_sorted_from_service = this.shop_products_sorted.asObservable();

  private xtra_products_sorted = new BehaviorSubject<Array<any>>([]);
  public xtra_products_sorted_from_service = this.xtra_products_sorted.asObservable();

  private prod_selected = new BehaviorSubject<number>(null);
  public prod_selected_from_service = this.prod_selected.asObservable();

  private select_one = new BehaviorSubject<boolean>(false);
  public select_one_from_service = this.select_one.asObservable();

  private responce_fromDB = new BehaviorSubject<Array<any>>([]);
  public responce_fromDB_from_service = this.responce_fromDB.asObservable();

  private my_favorites = new BehaviorSubject<Array<any>>(localStorage.getItem('my_764528_f') ? JSON.parse(localStorage.getItem('my_764528_f')) : []);
  public my_favorites_from_service = this.my_favorites.asObservable();

  private my_cart = new BehaviorSubject<Array<any>>(localStorage.getItem('my_764528_ct') ? JSON.parse(localStorage.getItem('my_764528_ct')) : []);
  public my_cart_from_service = this.my_cart.asObservable();

  constructor(
    private http: HttpClient,
    private respond_Service: RespondService
  ) { }

  // -----------------------------GET ALL PRODUCTS FROM DB------------------------
  getProducts_fromDB() {
    return this.http.get(`${this.prod_url}`).subscribe(res => {
      let products = res[0].allProductes;
      if (products) {
        this.shop_products.next([products]);
      } else console.error('no products came from server');
    });
  }
  // ----------------------------------SAVE NEW PRODUCT TO DB or UPDATE------------------------
  saveProduct_toDB(prod: object, language: string) {
    return this.http.post(`${this.prod_url}/${language}/save`, prod).subscribe(res => {
      // console.log(res);
      this.respond_Service.saveRespond(res);
      this.getProducts_fromDB();
    });
  }
  // ----------------------------------DELETE PRODUCT FROM DB BY ID ------------------------
  removeProduct_fromDB(id: number, language: string) {
    return this.http.get(`${this.prod_url}/${language}/remove/${id}`).subscribe(res => {
      // console.log(res);
      this.respond_Service.saveRespond(res);
      this.getProducts_fromDB();
    });
  }

  // ----------------------------------------------FUNCTIONS-----------------------
  // -------------------save products sorted ----------
  getProducts_sorted(sortedProds: Array<any>) {
    this.shop_products_sorted.next(sortedProds);
  }

  // -------------------save products extra sorted ----------
  getXtra_sorted(sortedProds: Array<any>) {
    this.xtra_products_sorted.next(sortedProds);
  }

  // -------------------get product selected and save ----------
  selectProd(prodIndex: number, open_state: boolean) {
    this.prod_selected.next(prodIndex);
    this.select_one.next(open_state);
  }

  //--------------------new favorites on service-----------
  favorites(new_arr: Array<any>) {
    this.my_favorites.next(new_arr);
  }

  //--------------------new cart on service-----------
  cart(new_arr: Array<any>) {
    this.my_cart.next(new_arr)
  }

}
