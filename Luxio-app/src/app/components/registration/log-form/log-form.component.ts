import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-servise/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-form',
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.css']
})
export class LogFormComponent implements OnInit {

  public isSubmitted: boolean;
  public formTemplate = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(
    private user_service: UserService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0)
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      this.user_service.userToLogin(formValue)
    } else {
      console.log('denied');
    }
  }

}
