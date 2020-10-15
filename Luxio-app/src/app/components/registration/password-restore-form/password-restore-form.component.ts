import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SaveUserService } from 'src/app/services/saveUser/save-user.service';


@Component({
  selector: 'app-password-restore-form',
  templateUrl: './password-restore-form.component.html',
  styleUrls: ['./password-restore-form.component.css']
})
export class PasswordRestoreFormComponent implements OnInit {

  private step_2: boolean = false;
  private denied: boolean = false;
  private response: string;
  public isSubmitted: boolean;
  public isSubmitted2: boolean;
  public formTemplate = new FormGroup({
    email: new FormControl('', Validators.required)
  });
  private passValid: boolean;
  public formTemplate2 = new FormGroup({
    tempPass: new FormControl('', Validators.required),
    newPass: new FormControl('', Validators.required),
    repeatPass: new FormControl('', Validators.required)
  });

  constructor(
    private saveUser_service: SaveUserService
  ) { }

  ngOnInit() {

    this.saveUser_service.newPas_from_service
      .subscribe(date => {
        this.response = date;
      })
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      console.log(formValue.email)
      this.saveUser_service.generateNewPass(formValue.email);
    } else {
      // console.log('denied');
      this.denied = true;
    }
  }

  get formControls2() {
    return this.formTemplate2['controls'];
  }

  onSubmit2(formValue, email) {
    this.isSubmitted2 = true;

    if (formValue.newPass && formValue.newPass === formValue.repeatPass) {
      this.passValid = true;
      // console.log(email)
      // console.log(formValue)
      this.saveUser_service.setNewPassword(formValue, email.email)
    } else {
      this.passValid = false;
    }

  }

}
