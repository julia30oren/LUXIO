import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private DB_url: string = 'http://localhost:5000';

  private shop_products = new BehaviorSubject<Array<any>>([]);
  public shop_products_from_service = this.shop_products.asObservable();

  private shop_products_sorted = new BehaviorSubject<Array<any>>([]);
  public shop_products_sorted_from_service = this.shop_products_sorted.asObservable();

  private xtra_products_sorted = new BehaviorSubject<Array<any>>([]);
  public xtra_products_sorted_from_service = this.xtra_products_sorted.asObservable();

  private prod_selected = new BehaviorSubject<Array<any>>([]);
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
    private http: HttpClient
  ) { }

  getProducts_fromDB() {
    return this.http.get(`${this.DB_url}/shop`).subscribe(res => {
      this.shop_products.next([res]);
    });
  }

  saveProduct_toDB(prod: object) {
    return this.http.post(`${this.DB_url}/shop/save`, prod).subscribe(res => {
      this.responce_fromDB.next([res]);
      this.getProducts_fromDB();
      // console.log(this.shop_products);
    });
  }

  removeProduct_fromDB(id: number) {
    return this.http.get(`${this.DB_url}/shop/remove/${id}`).subscribe(res => {
      this.shop_products.next([res]);
      this.getProducts_fromDB();
    });
  }

  getProducts_sorted(sortedProds: Array<any>) {
    this.shop_products_sorted.next(sortedProds);
  }

  getXtra_sorted(sortedProds: Array<any>) {
    this.xtra_products_sorted.next(sortedProds);
  }

  selectProd(prod: object, open_state: boolean) {
    this.prod_selected.next([prod]);
    this.select_one.next(open_state);
  }

  favorites(new_arr: Array<any>) {
    // console.log(new_arr);
    this.my_favorites.next(new_arr);
  }

  cart(new_arr: Array<any>) {
    this.my_cart.next(new_arr)
  }
}
