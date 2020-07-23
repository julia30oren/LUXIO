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

  constructor(
    private http: HttpClient
  ) { }

  getProducts_fromDB() {
    return this.http.get(`${this.DB_url}/shop`).subscribe(res => {
      this.shop_products.next([res]);
      // console.log(this.shop_products);
    });
  }

  getProducts_sorted(sortedProds: Array<any>) {
    // console.log(sortedProds);
    this.shop_products_sorted.next([sortedProds]);
  }

}
