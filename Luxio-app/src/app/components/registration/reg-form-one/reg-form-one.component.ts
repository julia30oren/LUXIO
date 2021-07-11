import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationService } from 'src/app/services/registation/registration.service';
import { ImgSearviceService } from 'src/app/services/imgService/img-searvice.service';
import { SaveUserService } from 'src/app/services/saveUser/save-user.service';
import { LanguageService } from 'src/app/services/language.service';
import { RespondService } from 'src/app/services/respond/respond.service';
import { CustomValidators } from './custom-validators';
@Component({
  selector: 'app-reg-form-one',
  templateUrl: './reg-form-one.component.html',
  styleUrls: ['./reg-form-one.component.css']
})
export class RegFormOneComponent implements OnInit {
  public stepTow: boolean = false;
  public frmSignup: FormGroup;
  public languege: string;
  public isSubmited: boolean;
  public closeToAsdod: boolean;
  public closeToNahariyya: boolean;
  public business: string;
  public salonName: string;
  public selectedImg: any = null;
  public selectedImg_link: string;
  public agreement: boolean;
  public buttonDisable: boolean = true;
  public termsToOpen: boolean = false;
  constructor(
    private fb: FormBuilder,
    private lang_service: LanguageService,
    private certifikate_Service: ImgSearviceService,
    private user_service: SaveUserService,
    private reg_service: RegistrationService,
    private respond_service: RespondService
  ) { this.frmSignup = this.createSignupForm(); }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });

    this.reg_service.regestration_formAgreement_from_service
      .subscribe(date => this.termsToOpen = date);

    this.respond_service.userAgreementPolicy_service
      .subscribe(date => {
        this.agreement = date;
        this.frmSignup.value.conditionsСonfirmation = date;
      });
  }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        conditionsСonfirmation: [false, Validators.compose([Validators.required])],
        first_name: [null, Validators.compose([Validators.required])],
        second_name: [''],
        email: [null, Validators.compose([Validators.email, Validators.required])],
        phoneN: [''],
        password: [null, Validators.compose([
          Validators.required,
          // check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          CustomValidators.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          ),
          Validators.minLength(8)
        ])
        ],
        confirmPassword: [null, Validators.compose([Validators.required])],
        state: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  go_stepTow() {
    this.stepTow = !this.stepTow;
  }

  agreementOpen() {
    this.termsToOpen = !this.termsToOpen;
  }

  cityCheck(city) {
    if (city === 'Center of Israel (close to Ashdod)') {
      this.closeToAsdod = true;
      this.closeToNahariyya = false;
    }
    else if (city === 'North of Israel (close to Nahariyya)'
      || city === 'North of Israel (close to Qiryat Shemona)'
      || city === 'North of Israel (close to Nazareth)'
      || city === 'North of Israel (close to Haifa)') {
      this.closeToAsdod = false;
      this.closeToNahariyya = true;
    }
    else {
      this.closeToAsdod = false;
      this.closeToNahariyya = false;
    }
  }

  businessCheck(type) {
    this.business = type;
  }

  setSalonName(value) {
    this.salonName = value;
  }

  agreementPolicy_check(value: boolean) {
    this.respond_service.agreementToCookiesPolicy(value);
  }

  showPreimg(event) {
    this.buttonDisable = true;
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      let formData = new FormData();
      formData.append('image', file);

      this.selectedImg = formData;
      if (this.selectedImg) {
        this.certifikate_Service.saveCertifikate(this.selectedImg);
        // image prevue
        this.certifikate_Service.certifikateLink_fromService
          .subscribe(date => {
            this.selectedImg_link = date;
            date ? this.buttonDisable = false : this.buttonDisable = true;
          });
      }
    }
    setTimeout(() => { }, 2000);
  }

  submit() {
    this.isSubmited = true;
    // do signup or something
    if (this.frmSignup.valid && this.business && this.agreement && !this.closeToNahariyya && !this.closeToAsdod) {
      if (this.business === 'salon representative' && this.salonName) {
        this.frmSignup.value.business = [{ type: this.business, salon: this.salonName }];
      }
      else if (this.business === 'self employed' && this.selectedImg_link) {
        this.frmSignup.value.business = [{ type: this.business, certifikate: this.selectedImg_link }];
      }
      this.frmSignup.value.cart = localStorage.getItem('my_764528_ct') ? JSON.parse(localStorage.getItem('my_764528_ct')) : [];
      this.frmSignup.value.favorites = localStorage.getItem('my_764528_f') ? JSON.parse(localStorage.getItem('my_764528_f')) : [];
      this.frmSignup.value.specialSet = localStorage.getItem('special_set') ? JSON.parse(localStorage.getItem('special_set')) : [];
      this.user_service.saveUser_toDB(this.frmSignup.value, this.languege);
      // close form
      this.reg_service.close_RegistrationForm();
    } else this.frmSignup.value.conditionsСonfirmation = false;
  }
}