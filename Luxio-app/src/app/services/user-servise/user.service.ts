import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private favorite = new BehaviorSubject<Array<any>>(JSON.parse(localStorage.getItem('us_2345_fav')) ? [JSON.parse(localStorage.getItem('us_2345_fav'))] : []);
  public favorite_from_service = this.favorite.asObservable();

  private cart = new BehaviorSubject<Array<any>>([]);
  public cart_from_service = this.cart.asObservable();

  constructor() { }

  saveToFavorites(prod: object, _id: number) {
    // console.log(prod);
    let newFav = JSON.parse(localStorage.getItem('us_2345_fav'));
    newFav.forEach(element => {
      if (element._id.includes(_id)) {
        console.log('no');
      } else {
        newFav.push(prod);
        localStorage.setItem('us_2345_fav', JSON.stringify(newFav));
        this.favorite.next(newFav);
      }
    });
    // let best = JSON.parse(localStorage.getItem('us_2345_fav'));
  }
}
