import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop/shop.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-shop',
  templateUrl: './admin-shop.component.html',
  styleUrls: ['./admin-shop.component.css']
})
export class AdminShopComponent implements OnInit {

  public new_form_open: boolean;
  public selectedProd: Array<any>;
  public isSubmitted: boolean;

  formTemplate = new FormGroup({
    burcode_id: new FormControl(null, Validators.required),
    name: new FormControl('', Validators.required),
    prod_class: new FormControl('', Validators.required),
    img_link: new FormControl(''),
    price: new FormControl(null, Validators.required),
    color: new FormControl('{}'),
    tint: new FormControl('{}'),
    transparency: new FormControl('{}'),
    label: new FormControl('{}')
  })

  constructor(
    private shop_service: ShopService
  ) { }

  ngOnInit() {
    this.shop_service.prod_selected_from_service
      .subscribe((date) => {
        this.selectedProd = date;
        if (this.selectedProd[0]) {


          this.selectedProd[0].color = JSON.stringify(this.selectedProd[0].color);
        }
        // this.formTemplate.reset();
        // this.formTemplate.setValue({
        //   burcode_id: this.selectedProd[0].burcode_id,
        //   name: this.selectedProd[0].name,
        //   // prod_class: new FormControl('', Validators.required),
        //   // img_link: new FormControl(''),
        //   // price: new FormControl(null, Validators.required),
        //   // color: new FormControl('{}'),
        //   // tint: new FormControl('{}'),
        //   // transparency: new FormControl('{}'),
        //   // label: new FormControl('{}')
        // });
        // console.log(this.formTemplate);
      });
  }

  openForm() {
    this.new_form_open = !this.new_form_open;
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      console.log(formValue);
      formValue.color = JSON.parse(formValue.color);
      formValue.tint = JSON.parse(formValue.tint);
      formValue.transparency = JSON.parse(formValue.transparency);


      this.shop_service.saveProduct_toDB(formValue);
      // var filePath = `certificates/certificate:(${formValue.name})_${this.selectedImg.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`
      // const fileRef = this.firestorage.ref(filePath);
      // this.firestorage
      //   .upload(filePath, this.selectedImg)
      //   .snapshotChanges()
      //   .pipe(finalize(() => {
      //     fileRef.getDownloadURL()
      //       .subscribe((url) => {
      //         formValue['imageURL'] = url;
      //         this.cert_service.insertImageDetails(formValue);
      //         this.resetForm();
      //       })
      //   }))
      //   .subscribe();
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  // resetForm() {
  //   this.formTemplate.reset();
  //   this.formTemplate.setValue({
  //     name: '',
  //     imageURL: '',
  //     category: ''
  //   });
  // }
}
