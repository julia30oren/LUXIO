import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop/shop.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LanguageService } from 'src/app/services/language.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-admin-shop',
  templateUrl: './admin-shop.component.html',
  styleUrls: ['./admin-shop.component.css']
})
export class AdminShopComponent implements OnInit {

  public shop: Array<any>;
  public formOpen: boolean;
  public accessoriesState: boolean;
  public isSubmitted: boolean;
  public responce_from_DB: Array<any>;
  public searchText: any;
  public searchRes: Array<any>;
  public language: string;
  public prod_toDelete: Array<any>;
  public admin: boolean;

  formTemplate = new FormGroup({
    burcode_id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    prod_class: new FormControl('', Validators.required),
    prod_collection: new FormControl(''),
    color: new FormControl(''),
    tint: new FormControl(''),
    transparency: new FormControl(''),
    label: new FormControl(''),
    img_link_1: new FormControl('', Validators.required),
    img_link_2: new FormControl(''),
    img_link_3: new FormControl(''),
    img_link_4: new FormControl(''),
    img_link_5: new FormControl(''),
    img_link_6: new FormControl(''),
    amount_1: new FormControl('', Validators.required),
    price_1: new FormControl(null, Validators.required),
    amount_2: new FormControl(''),
    price_2: new FormControl(null),
    amount_3: new FormControl(''),
    price_3: new FormControl(null),
    amount_4: new FormControl(''),
    price_4: new FormControl(null),
    amount_5: new FormControl(''),
    price_5: new FormControl(null),
    amount_6: new FormControl(''),
    price_6: new FormControl(null),
    coment_eng: new FormControl(''),
    coment_iv: new FormControl(''),
    coment_rus: new FormControl('')
  })

  constructor(
    private router: Router,
    private user_Service: UserService,
    private shop_service: ShopService,
    private lang_service: LanguageService
  ) { }

  ngOnInit() {
    this.adminCheck();

    this.lang_service._selected_from_service ///language subscribe
      .subscribe(date => this.language = date);

    this.user_Service.asAdmin_from_service ///if admin IS admin
      .subscribe(date => {
        this.admin = date;
        setTimeout(() => {
          if (this.admin) {
            this.shop_service.getProducts_fromDB();

            this.shop_service.shop_products_from_service
              .subscribe(date => {
                this.shop = date[0];
              });
          } else {
            this.router.navigate(['/**']);
          }
        }, 1000);
      });

    this.shop_service.responce_fromDB_from_service ///responce subscribe
      .subscribe(date => {
        this.responce_from_DB = date;
        if (this.responce_from_DB[0]) {
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

  adminCheck() {
    let adminToken = localStorage.getItem('token');
    if (adminToken) {
      this.user_Service.adminTokenCheck(adminToken);
    } else this.router.navigate(['/**']);
  }

  classCheck() {
    if (this.formTemplate.value.prod_class === 'accessories') this.accessoriesState = true;
    else this.accessoriesState = false;
  }

  openForm(state) {
    this.formOpen = state;
    if (state) window.scrollTo(0, 0);
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    console.log(this.formTemplate.value)
    if (this.formTemplate.valid) this.shop_service.saveProduct_toDB(formValue, this.language);
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  delete(prod_id) {
    this.prod_toDelete = [];
    this.shop.forEach(element => {
      if (element._id === prod_id) this.prod_toDelete.push(element);
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
    this.isSubmitted = false;
  }

  select(id: number) {
    this.shop.find(element => {
      if (element._id === id) {
        if (element.prod_class === 'accessories') { this.accessoriesState = true } else this.accessoriesState = false;
        this.formTemplate.patchValue({
          burcode_id: element.burcode_id,
          name: element.name,
          prod_class: element.prod_class,
          prod_collection: element.prod_collection || '',
          color: element.color || '',
          tint: element.tint || '',
          transparency: element.transparency || '',
          label: element.label || '',
          amount_1: element.amount_1,
          price_1: element.price_1,
          amount_2: element.amount_2 || '',
          price_2: element.price_2 || null,
          amount_3: element.amount_3 || '',
          price_3: element.price_3 || null,
          amount_4: element.amount_4 || '',
          price_4: element.price_4 || null,
          amount_5: element.amount_5 || '',
          price_5: element.price_5 || null,
          amount_6: element.amount_6 || '',
          price_6: element.price_6 || null,
          img_link_1: element.img_link_1,
          img_link_2: element.img_link_2 || '',
          img_link_3: element.img_link_3 || '',
          img_link_4: element.img_link_4 || '',
          img_link_5: element.img_link_5 || '',
          img_link_6: element.img_link_6 || '',
          coment_eng: element.coment_eng || '',
          coment_iv: element.coment_iv || '',
          coment_rus: element.coment_rus || ''
        });
        // console.log(this.formTemplate.value)
      }
    });
  }
}