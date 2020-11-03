import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop/shop.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-admin-shop',
  templateUrl: './admin-shop.component.html',
  styleUrls: ['./admin-shop.component.css']
})
export class AdminShopComponent implements OnInit {

  public shop: Array<any>;
  public new_form_open: boolean;
  public selectedProd: Array<any>;
  public isSubmitted: boolean;
  public imgSelected1: string;
  public imgSelected2: string;
  public imgSelected3: string;
  public responce_from_DB: Array<any>;
  public searchText: any;
  public searchRes: Array<any>;
  public language: string;
  private prod_toDelete: Array<any>;

  formTemplate = new FormGroup({
    burcode_id: new FormControl(null, Validators.required),
    name: new FormControl('', Validators.required),
    prod_class: new FormControl('', Validators.required),
    prod_collection: new FormControl(''),
    img_link_1: new FormControl('', Validators.required),
    img_link_2: new FormControl(''),
    img_link_3: new FormControl(''),
    amount_1: new FormControl('', Validators.required),
    price_1: new FormControl(null, Validators.required),
    amount_2: new FormControl(''),
    price_2: new FormControl(null),
    color: new FormControl(''),
    tint: new FormControl(''),
    transparency: new FormControl(''),
    label: new FormControl(''),
    coment_eng: new FormControl(''),
    coment_iv: new FormControl(''),
    coment_rus: new FormControl('')
  })

  constructor(
    private shop_service: ShopService,
    private lang_service: LanguageService
  ) { }

  ngOnInit() {
    this.shop_service.getProducts_fromDB();

    this.shop_service.shop_products_from_service
      .subscribe(date => {
        this.shop = date[0];
        // this.shop_service.getProducts_sorted(this.shop);
      });

    this.lang_service._selected_from_service
      .subscribe(date => { this.language = date })

    this.shop_service.responce_fromDB_from_service
      .subscribe(date => {
        this.responce_from_DB = date;
        if (this.responce_from_DB[0]) {
          // console.log(this.responce_from_DB);
          if (this.responce_from_DB[0].state === 1) {
            alert(this.responce_from_DB[0].message);
            this.clearForm();
          } else if (this.responce_from_DB[0].state === 2) {
            alert(this.responce_from_DB[0].message);
            this.clearForm();
          }
        }
      })
  }



  openForm(state) {
    this.new_form_open = state;
    if (state) {
      window.scrollTo(0, 0)
    }
  }

  showImg1(value) {
    this.imgSelected1 = value;
  }
  showImg2(value) {
    this.imgSelected2 = value;
  }
  showImg3(value) {
    this.imgSelected3 = value;
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      // console.log(formValue);
      this.shop_service.saveProduct_toDB(formValue, this.language);
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  delete(user_id) {
    this.prod_toDelete = [];
    this.shop.forEach(element => {
      if (element._id === user_id) {
        this.prod_toDelete.push(element);
      }
    });
  }

  deleteState(st: boolean) {
    if (st) {
      this.shop_service.removeProduct_fromDB(this.prod_toDelete[0]._id, this.language);
      this.prod_toDelete = null;
    } else this.prod_toDelete = null;
  }

  clearForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      burcode_id: null,
      name: '',
      prod_class: '',
      img_link_1: '',
      img_link_2: '',
      img_link_3: '',
      amount_1: '',
      price_1: null,
      amount_2: '',
      price_2: null,
      color: '',
      tint: '',
      prod_collection: '',
      transparency: '',
      label: '',
      coment_eng: '',
      coment_iv: '',
      coment_rus: ''
    });
    this.isSubmitted = false;
    this.imgSelected1 = '';
    this.selectedProd = [];
  }

  select(id: number) {
    console.log(id);
    this.shop.forEach(element => {
      if (element.burcode_id === id) {
        // console.log(element)
        this.imgSelected1 = element.img_link || element.img_link_1;
        this.imgSelected2 = element.img_link_2;
        this.imgSelected3 = element.img_link_3;

        this.formTemplate.setValue({
          burcode_id: element.burcode_id,
          name: element.name,
          prod_class: element.prod_class,
          prod_collection: element.prod_collection || '',
          amount_1: element.amount_1,
          price_1: element.price_1,
          amount_2: element.amount_2,
          price_2: element.price_2,
          img_link_1: element.img_link_1 || element.img_link,
          img_link_2: element.img_link_2 || '',
          img_link_3: element.img_link_3 || '',
          color: element.color,
          tint: element.tint,
          transparency: element.transparency,
          label: element.label,
          coment_eng: element.coment_eng,
          coment_iv: element.coment_iv,
          coment_rus: element.coment_rus
        });

        // this.shop_service.selectProd(element);
      }
    });
  }
}