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
  private langIv: boolean;

  formTemplate = new FormGroup({
    burcode_id: new FormControl(null, Validators.required),
    name: new FormControl('', Validators.required),
    prod_class: new FormControl('', Validators.required),
    prod_collection: new FormControl(''),
    img_link_1: new FormControl(''),
    img_link_2: new FormControl(''),
    img_link_3: new FormControl(''),
    price: new FormControl(null, Validators.required),
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
      .subscribe(date => {
        if (date === 'iv') {
          this.langIv = true;
        } else this.langIv = false;
        // console.log(date)
      })

    this.shop_service.prod_selected_from_service
      .subscribe(date => {
        this.selectedProd = date;
        if (this.selectedProd[0]) {
          // console.log(this.selectedProd[0].burcode_id);
          this.formTemplate.setValue({
            burcode_id: this.selectedProd[0].burcode_id,
            name: this.selectedProd[0].name,
            prod_class: this.selectedProd[0].prod_class,
            prod_collection: this.selectedProd[0].prod_collection || '',
            img_link_1: this.selectedProd[0].img_link_1,
            img_link_2: this.selectedProd[0].img_link_2,
            img_link_3: this.selectedProd[0].img_link_3,
            price: this.selectedProd[0].price,
            color: this.selectedProd[0].color || '',
            tint: this.selectedProd[0].tint || '',
            transparency: this.selectedProd[0].transparency || '',
            label: this.selectedProd[0].label || '',
            coment_eng: this.selectedProd[0].coment_eng || '',
            coment_iv: this.selectedProd[0].coment_iv || '',
            coment_rus: this.selectedProd[0].coment_rus || ''
          });
        }
      });
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

  delete(byId) {
    // console.log(byId);
    this.shop_service.removeProduct_fromDB(byId);
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
      console.log(formValue);

      this.shop_service.saveProduct_toDB(formValue);
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
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
      price: null,
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
    // console.log(id);
    this.shop.forEach(element => {
      if (element.burcode_id === id) {
        this.imgSelected1 = element.img_link;
        this.shop_service.selectProd(element);
      }
    });
  }
}