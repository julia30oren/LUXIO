import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/services/language.service';
import { RegistrationService } from 'src/app/services/registation/registration.service';
import { RespondService } from 'src/app/services/respond/respond.service';
import { SaveUserService } from 'src/app/services/saveUser/save-user.service';


@Component({
  selector: 'app-password-restore-form',
  templateUrl: './password-restore-form.component.html',
  styleUrls: ['./password-restore-form.component.css']
})
export class PasswordRestoreFormComponent implements OnInit {

  public language: string;
  public openForm: boolean;
  public formTemplate = new FormGroup({
    email: new FormControl('', Validators.required)
  });
  public isSubmitted: boolean;
  public denied: boolean = false;
  public passValid: boolean;
  public formTemplate2 = new FormGroup({
    tempPass: new FormControl('', Validators.required),
    newPass: new FormControl('', Validators.required),
    repeatPass: new FormControl('', Validators.required)
  });
  public isSubmitted2: boolean;

  constructor(
    private language_Service: LanguageService,
    private respond_Service: RespondService,
    // private regestration_Service: RegistrationService,
    private saveUser_Service: SaveUserService
  ) { }

  ngOnInit() {
    this.language_Service._selected_from_service
      .subscribe(date => this.language = date);

    // this.respond_Service.respond_fromServer_service
    //   .subscribe(date => {
    //     console.log(date)
    //   });

    this.saveUser_Service.stateForm_from_service
      .subscribe(date => {
        console.log(date);
        this.openForm = date;
      })
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      this.saveUser_Service.generateNewPass(formValue.email.toLowerCase(), this.language);
    } else {
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
      this.saveUser_Service.setNewPassword(formValue, email.email.toLowerCase(), this.language);
    } else {
      this.passValid = false;
    }

  }

}
