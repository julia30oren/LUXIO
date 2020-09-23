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

  private languege: string;
  private user: Array<any>;
  public formTemplate = new FormGroup({
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

  constructor(
    private lang_service: LanguageService,
    private user_service: UserService
  ) { }

  ngOnInit() {
    this.user_service.getUser(localStorage.getItem('u324_3i_25d'));

    this.lang_service._selected_from_service
      .subscribe(date => this.languege = date);

    this.user_service.user_full_from_service
      .subscribe(date => {
        this.user = date[0];
        if (date[0]) {
          this.formTemplate.setValue({
            _id: date[0][0]._id || '',
            first_name: date[0][0].first_name || '',
            second_name: date[0][0].second_name || '',
            email: date[0][0].email || '',
            phoneN: date[0][0].phoneN || '',

            city: date[0][0].city || '',
            state: date[0][0].street || '',
            street: date[0][0].street || '',
            zip: date[0][0].zip || null,
            home: date[0][0].home || '',
            apartment: date[0][0].apartment || ''
          });
        }
      })
  }

  onSubmit(formValue) {
    // console.log(formValue);
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      this.user_service.saveUserChanges_toDB(formValue);
    } else {
      console.log('denied');
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }



}
