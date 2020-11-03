import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-servise/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-private-info',
  templateUrl: './private-info.component.html',
  styleUrls: ['./private-info.component.css']
})
export class PrivateInfoComponent implements OnInit {

  public loader: boolean = true;
  private languege: string;
  private user: Array<any>;
  private infoTemplate = new FormGroup({
    _id: new FormControl('', Validators.required),
    first_name: new FormControl('', Validators.required),
    second_name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phoneN: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl(''),
    street: new FormControl(''),
    zip: new FormControl(null),
    home: new FormControl(''),
    apartment: new FormControl(''),
  });
  public isSubmitted: boolean;
  private formTemplate_password = new FormGroup({
    old_pass: new FormControl('', Validators.required),
    new_pass: new FormControl('', Validators.required),
    conf_new: new FormControl('', Validators.required),
  });
  public isSubmittedPass: boolean;
  public conf_new: boolean = true;

  constructor(
    private language_Service: LanguageService,
    private user_Service: UserService
  ) { }

  ngOnInit() {
    this.user_Service.getUser(localStorage.getItem('u324_3i_25d'), this.languege);

    this.language_Service._selected_from_service
      .subscribe(date => this.languege = date);

    this.user_Service.user_full_from_service
      .subscribe(date => {
        console.log(date)
        this.user = date;
        window.setTimeout(() => {
          this.infoTemplate.setValue({
            _id: this.user[0]._id || '',
            first_name: this.user[0].first_name || '',
            second_name: this.user[0].second_name || '',
            email: this.user[0].email || '',
            phoneN: this.user[0].phoneN || '',
            city: this.user[0].city || '',
            state: this.user[0].street || '',
            street: this.user[0].street || '',
            zip: this.user[0].zip || null,
            home: this.user[0].home || '',
            apartment: this.user[0].apartment || ''
          });
          this.loader = false;
        }, 2000);
      });
  }

  newInfoSave(formValue) {
    let id = this.user[0]._id;
    this.isSubmitted = true;
    if (this.infoTemplate.valid) {
      this.user_Service.saveUserChanges_toDB(id, formValue, this.languege);
    } else {
      console.log('denied');
    }
  }
  get formControls() {
    return this.infoTemplate['controls'];
  }

  newPassSave(formValue) {
    this.isSubmittedPass = true;
    if (this.formTemplate_password.valid && formValue.new_pass === formValue.conf_new) {
      this.conf_new = true;
      this.user_Service.saveNewPassword(this.user[0].email, formValue, this.languege);
    } else {
      this.conf_new = false;
      console.log('denied');
    }
  }
  get formControlsPassword() {
    return this.formTemplate_password['controls'];
  }
}
