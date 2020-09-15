import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  private languege: string;
  public isSubmitted: boolean;
  public formTemplate = new FormGroup({
    comment: new FormControl('', Validators.required),
  })

  constructor(
    private lang_service: LanguageService,
    private user_service: UserService
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => this.languege = date)
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      formValue.user_id = localStorage.getItem('u324_3i_25d');
      formValue.user_name = localStorage.getItem('u324_n4325e');
      formValue.user_languege = this.languege;
      this.user_service.leaveAcomment(formValue);
    } else {
      console.log('denied');
    }
  }

}
