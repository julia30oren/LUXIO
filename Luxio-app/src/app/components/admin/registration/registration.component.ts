import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { LanguageService } from 'src/app/services/language.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-servise/user.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public language: string;
  public isSubmitted: boolean;
  public formTemplate = new FormGroup({
    email: new FormControl('', Validators.required),
    main_password: new FormControl('', Validators.required),
    admin_name: new FormControl('', Validators.required),
    admin_password: new FormControl('', Validators.required)
  });
  public admin: boolean;

  constructor(
    private router: Router,
    private user_Service: UserService,
    private lang_service: LanguageService
  ) { }

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

  adminCheck() {
    let adminToken = localStorage.getItem('token');
    if (adminToken) {
      this.user_Service.adminTokenCheck(adminToken);
    } else this.router.navigate(['/**']);
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      console.log(formValue);
    } else {
      alert('denied');
    }
  }
}
