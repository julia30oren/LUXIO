import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ShopService } from 'src/app/services/shop/shop.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-commertial',
  templateUrl: './commertial.component.html',
  styleUrls: ['./commertial.component.css']
})
export class CommertialComponent implements OnInit {

  public languege: string;
  public shop: Array<any>;
  public Tarray: Array<any>;
  public luxios: Array<any>;
  public present: Array<any>;
  public loader: boolean;
  public showButton: boolean;
  public set: Array<any>;

  public formTemplate = new FormGroup({
    luxio_1: new FormControl('', Validators.required),
    luxio_2: new FormControl('', Validators.required),
    luxio_3: new FormControl('', Validators.required),
    luxio_4: new FormControl('', Validators.required),
    luxio_5: new FormControl('', Validators.required),
    forFree: new FormControl('', Validators.required)
  });
  public isSubmitted: boolean;

  constructor(
    private lang_service: LanguageService,
    private shop_service: ShopService,
    private user_service: UserService
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => {
        this.languege = date;
      });

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        if (date[0]) {
          this.shop = date[0];
          this.getForSale();
        }
      });
  }

  getForSale() {
    this.luxios = [];
    this.present = [];
    this.shop.forEach(element => {
      if (element.prod_class === 'Luxio' || element.prod_class === 'basics') {
        this.luxios.push(element);
      }
    });
    this.shop.forEach(element => {
      if (element.prod_class === 'Luxio' || element.prod_class === 'basics' || element.prod_class === 'Options' || element.prod_class === 'Gel Play') {
        this.present.push(element);
      }
    });
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  DDD(x, price) {
    let itemYoSave = {
      _id: x._id,
      burcode_id: x.burcode_id,
      prod_class: x.prod_class,
      name: x.name,
      amount: x.amount_1,
      img_link_1: x.img_link_1,
      total_price: price
    };
    return this.Tarray.push(itemYoSave);
  }

  addSetToCard(form) {
    this.isSubmitted = true;
    let { luxio_1, luxio_2, luxio_3, luxio_4, luxio_5, forFree } = this.formTemplate.value;
    this.Tarray = [];
    this.luxios.filter(x => { x._id === luxio_1 ? this.DDD(x, 117) : null });
    this.luxios.filter(x => { x._id === luxio_2 ? this.DDD(x, 117) : null });
    this.luxios.filter(x => { x._id === luxio_3 ? this.DDD(x, 117) : null });
    this.luxios.filter(x => { x._id === luxio_4 ? this.DDD(x, 117) : null });
    this.luxios.filter(x => { x._id === luxio_5 ? this.DDD(x, 117) : null });
    this.luxios.filter(x => { x._id === forFree ? this.DDD(x, 0) : null });

    let set_id = Math.floor(Math.random() * 999) + '-a' + Math.floor(Math.random() * 999);
    let userId = localStorage.getItem('u324_3i_25d');
    this.user_service.saveSpecialSet_toDB(userId, set_id, this.Tarray, this.languege); // send to DB
  }

  checkForm() {
    if (this.formTemplate.valid) {
      this.showButton = true;
    }
  }

  restartForm() {
    this.loader = true; // loader
    setTimeout(() => { //thank you
      this.loader = false;
      this.showButton = false;
      this.isSubmitted = false;
      this.formTemplate.reset();
    }, 2000);
  }

}
