import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-servise/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-log-form',
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.css']
})
export class LogFormComponent implements OnInit {

  public languege: string;
  public isSubmitted: boolean;
  public formTemplate = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  private asAdmin: boolean;
  public isSubmitted2: boolean;
  public formTemplate2 = new FormGroup({
    email: new FormControl('', Validators.required),
    main_password: new FormControl('', Validators.required),
    admin_name: new FormControl('', Validators.required),
    admin_password: new FormControl('', Validators.required)
  })


  constructor(
    private language_Service: LanguageService,
    private user_Service: UserService
  ) { }

  ngOnInit() {
    // window.scrollTo(0, 0);
    this.language_Service._selected_from_service
      .subscribe(date => { this.languege = date });

    this.user_Service.asAdmin_from_service
      .subscribe(date => {
        if (date) { //log in as admin
          this.asAdmin = date;
          this.formTemplate2.setValue({ //email, main_password, admin_name, admin_password
            email: '',
            main_password: '',
            admin_name: this.formTemplate.value.email, //seting email(as Admin name) from formTemplate for users
            admin_password: this.formTemplate.value.password //seting password(as admin password) from formTemplate for users
          });
        }
      })
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      this.user_Service.userToLogin(formValue, this.languege)
    } else {
      console.log('denied');
    }
  }

  get formControls2() {
    return this.formTemplate2['controls'];
  }

  onSubmit2(formValue) {
    this.isSubmitted2 = true;
    console.log(formValue)
    if (this.formTemplate2.valid) {
      this.user_Service.logInadmin(formValue, this.languege)
    } else {
      console.log('denied');
    }
  }

}
