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

  private prod_selected = new BehaviorSubject<Array<any>>([]);
  public prod_selected_from_service = this.prod_selected.asObservable();

  private responce_fromDB = new BehaviorSubject<Array<any>>([]);
  public responce_fromDB_from_service = this.responce_fromDB.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getProducts_fromDB() {
    return this.http.get(`${this.DB_url}/shop`).subscribe(res => {
      this.shop_products.next([res]);
      // console.log(this.shop_products);
    });
  }

  saveProduct_toDB(prod: object) {
    return this.http.post(`${this.DB_url}/shop/save`, prod).subscribe(res => {
      this.responce_fromDB.next([res]);
      // console.log(this.shop_products);
    });
  }

  getProducts_sorted(sortedProds: Array<any>) {
    // console.log(sortedProds);
    this.shop_products_sorted.next([sortedProds]);
  }

  selectProd(prod: object) {
    // console.log(prod);
    this.prod_selected.next([prod]);
  }

}
