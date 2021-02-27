import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { LanguageService } from 'src/app/services/language.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../registration/reg-form-one/custom-validators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public language: string;
  public admin: boolean;
  public isSubmited: boolean;
  public frmSignupAdmin: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private user_Service: UserService,
    private lang_service: LanguageService,
    private admin_service: AdminServiceService
  ) { this.frmSignupAdmin = this.createSignupForm(); }

  ngOnInit() {
    this.adminCheck();
    this.lang_service._selected_from_service ///language subscribe
      .subscribe(date => this.language = date);

    this.user_Service.asAdmin_from_service
      .subscribe(date => {
        this.admin = date;
        setTimeout(() => {
          if (!this.admin) {
            this.router.navigate(['/**']);
          }
        }, 1000);
      });
  }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        main_password: [null, Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.email, Validators.required])],
        admin_name: [null, Validators.compose([Validators.required])],
        admin_password: [null, Validators.compose([
          Validators.required,
          // check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          Validators.minLength(8)
        ])
        ],
      }
    );
  }

  adminCheck() {
    let adminToken = localStorage.getItem('token');
    if (adminToken) {
      this.user_Service.adminTokenCheck(adminToken);
    } else this.router.navigate(['/**']);
  }

  submit() {
    this.isSubmited = true;
    if (this.frmSignupAdmin.valid) {
      this.admin_service.createAdmin(this.frmSignupAdmin.value, this.language)
    } else {
      alert('All lines need to be filed!');
    }
  }
}
