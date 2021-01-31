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
  public asAdmin: boolean;
  public isSubmitted2: boolean;
  public formTemplate2 = new FormGroup({
    main_email: new FormControl('', Validators.required),
    main_password: new FormControl('', Validators.required),
    admin_name: new FormControl('', Validators.required),
    admin_password: new FormControl('', Validators.required)
  })// main_email, main_password, admin_name, admin_password


  constructor(
    private language_Service: LanguageService,
    private user_Service: UserService
  ) { }

  ngOnInit() {
    // window.scrollTo(0, 0);
    this.language_Service._selected_from_service
      .subscribe(date => { this.languege = date });

    // this.user_Service.asAdmin_from_service
    //   .subscribe(date => {
    //     this.asAdmin = date;
    //     if (this.asAdmin) { //loged as admin
    //       this.formTemplate2.setValue({ //email, main_password, admin_name, admin_password
    //         main_email: '',
    //         main_password: '',
    //         admin_name: this.formTemplate.value.email, //seting email(as Admin name) from formTemplate for users
    //         admin_password: this.formTemplate.value.password //seting password(as admin password) from formTemplate for users
    //       });
    //     }
    //   })
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  onSubmit(formValue) {
    this.isSubmitted = true;

    if (formValue.email.includes('@')) {
      if (this.formTemplate.valid) {
        formValue.email = formValue.email.toLowerCase();
        this.user_Service.userToLogin(formValue, this.languege);
      } else {
        alert('denied');
      }
    } else {
      this.formTemplate2.setValue({ //email, main_password, admin_name, admin_password
        admin_name: formValue.email, //seting email(as Admin name) from formTemplate for users
        admin_password: formValue.password,  //seting password(as admin password) from formTemplate for users
        main_email: "",
        main_password: "",
      });
      this.asAdmin = true;
    }
  }

  get formControls2() {
    return this.formTemplate2['controls'];
  }

  // ----------------------------SUBMIT FOR ADMIN
  onSubmit2(formValue) {
    // main_email, main_password, admin_name, admin_password
    this.isSubmitted2 = true;
    if (this.formTemplate2.valid) {
      formValue.admin_name = formValue.admin_name.toLowerCase();
      formValue.main_email = formValue.main_email.toLowerCase();
      this.user_Service.logInadmin(formValue, this.languege)
    } else {
      alert('denied');
    }
    this.asAdmin = false;

  }

}
