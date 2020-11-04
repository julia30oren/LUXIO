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

  constructor(
    private language_Service: LanguageService,
    private user_service: UserService
  ) { }

  ngOnInit() {
    // window.scrollTo(0, 0);
    this.language_Service._selected_from_service
      .subscribe(date => { this.languege = date });
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      this.user_service.userToLogin(formValue, this.languege)
    } else {
      console.log('denied');
    }
  }

}
