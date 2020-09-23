import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {

  public formTemplate = new FormGroup({
    comment: new FormControl('', Validators.required),
  });
  public languege: string;
  public isSubmitted: boolean;

  constructor(
    private lang_service: LanguageService,
    private user_service: UserService
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });
  }

  onSubmit(formValue) {
    console.log(formValue)
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      formValue.user_id = localStorage.getItem('u324_3i_25d');
      formValue.user_name = localStorage.getItem('u324_n4325e');
      formValue.user_languege = this.languege;
      this.user_service.leaveAcomment(formValue);
      this.resetForm();
    } else {
      console.log('denied');
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.setValue({
      comment: '',
    });
    this.isSubmitted = false;
  }

}