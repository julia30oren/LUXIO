import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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

  public frmSignup: FormGroup;
  public languege: string;
  public isSubmited: boolean;
  public closeToAsdod: boolean;
  public closeToNahariyya: boolean;
  public business: string;
  public salonName: string;
  public selectedImg: any = null;
  public selectedImg_link: string;
  constructor(
    private fb: FormBuilder,
    private lang_service: LanguageService,
    private certifikate_Service: ImgSearviceService,
  ) { this.frmSignup = this.createSignupForm(); }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });
  }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])],
        surname: [null],
        email: [null, Validators.compose([Validators.email, Validators.required])],
        phoneN: [null],
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
        location: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  cityCheck(city) {
    if (city === 'Center of Israel (close to Ashdod)') {
      this.closeToAsdod = true;
      this.closeToNahariyya = false;
    }
    else if (city === 'North of Israel (close to Nahariyya)') {
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

  agreementPolicy_check(value) {
    console.log(value);
  }

  showPreimg(event) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      let formData = new FormData();
      formData.append('image', file);

      this.selectedImg = formData;
      if (this.selectedImg) {
        this.certifikate_Service.saveCertifikate(this.selectedImg);
        // image prevue
        this.certifikate_Service.certifikateLink_fromService
          .subscribe(date => this.selectedImg_link = date);
      }
    }
  }

  submit() {
    // business: { type: this.business, certifikate: this.selectedImg_link || salon: this.salonName }
    // confirmPassword: "Justdoit2day!"
    // email: "Juliaoren30@jmail.com"
    // location: "Center of Israel (close to Tel Aviv)"
    // name: "Julia Orendovskyi"
    // password: "Justdoit2day!"
    // phoneN: "0524458442" || null
    // business_details: "salon name" || "certifikate link"
    // surname: null
    this.isSubmited = true;
    // do signup or something
    if (this.frmSignup.valid && this.business) {
      if (this.business === 'salon representative' && this.salonName) {
        this.frmSignup.value.business = { type: this.business, salon: this.salonName };
        console.log(this.frmSignup.value);
      }
      else if (this.business === 'self employed' && this.selectedImg_link) {
        this.frmSignup.value.business = { type: this.business, certifikate: this.selectedImg_link };
        console.log(this.frmSignup.value);
      }
    }
  }
}