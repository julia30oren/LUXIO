import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from 'src/app/services/registation/registration.service';
import { ImageService } from 'src/app/services/imgService/img-searvice.service';
import { SaveUserService } from 'src/app/services/saveUser/save-user.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-reg-form-one',
  templateUrl: './reg-form-one.component.html',
  styleUrls: ['./reg-form-one.component.css']
})
export class RegFormOneComponent implements OnInit {

  public languege: string;

  public formTemplate = new FormGroup({
    first_name: new FormControl('', Validators.required),
    second_name: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phoneN: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    agreement: new FormControl(false, Validators.required)
  })

  imgSrc: string;
  selectedImg: any = null;
  public password1: string = '';
  public password2: boolean;
  public User_agreed: boolean;
  public isSubmitted: boolean;
  public category: string;
  public business_name: string;
  public business_id: string;

  constructor(
    private regService: RegistrationService,
    private cert_service: ImageService,
    private users_db: SaveUserService,
    private lang_service: LanguageService
  ) { }

  ngOnInit() {
    this.regService.conditions_of_use_from_service
      .subscribe(date => this.User_agreed = date);

    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });
  }

  getTermsOfAgeement() {
    this.regService.AgreementPage();
  }

  showPreimg(event: any) {
    if (event.target.files && event.target.files[0]) {

      // image prevue
      const reader = new FileReader();
      reader.onload = (e: any) => { this.imgSrc = e.target.result; };
      reader.readAsDataURL(event.target.files[0]);
      this.imgSrc = event.target.files[0];

      // image file
      let file = event.target.files[0];
      let formData = new FormData();
      formData.append('image', file);

      this.selectedImg = formData;
    }
  }

  set_businessName(b_name) {
    this.business_name = b_name;
  }
  set_businessId(b_id) {
    this.business_id = b_id;
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid && this.password2) {
      if (this.User_agreed) {
        formValue.agreement = this.User_agreed;
        formValue.cart = JSON.parse(localStorage.getItem('my_764528_ct')) ? JSON.parse(localStorage.getItem('my_764528_ct')) : [];
        formValue.favorites = JSON.parse(localStorage.getItem('my_764528_f')) ? JSON.parse(localStorage.getItem('my_764528_f')) : []
        this.Save(formValue);
      }
    } else {
      console.log('denied');
    }
  }

  Save(formValue) {
    if (this.category === 'self employed' && this.imgSrc) {
      this.cert_service.insertImageDetails(this.selectedImg, formValue);
      this.resetForm();
      this.regService.close_RegistrationForm();
    } else if (this.category === 'salon representative') {
      formValue.business = { name: this.business_name, id: this.business_id };
      formValue.languege = this.languege;
      this.users_db.saveUser_toDB(formValue);
      this.resetForm();
      this.regService.close_RegistrationForm();
    }


  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  password1_change(pas1) {
    this.password1 = pas1;
  }

  password2_change(pas2) {
    if (this.password1 === pas2) {
      this.password2 = true;
    } else this.password2 = false;
  }

  terms_check(val) {
    // console.log(val);
    this.regService.user_agree_with_terms(val);
  }

  category_check(category) {
    console.log(category);
    this.category = category;
  }

  resetForm() {
    this.isSubmitted = false;
    this.imgSrc = '';
    this.selectedImg = null;
    this.formTemplate.reset();
    this.formTemplate.setValue({
      first_name: '',
      second_name: '',
      city: '',
      email: '',
      phoneN: '',
      password: '',
      category: '',
      agreement: false
    });
  }
}