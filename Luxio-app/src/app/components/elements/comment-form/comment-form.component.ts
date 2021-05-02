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
  public language: string;
  public isSubmitted: boolean;

  constructor(
    private language_Service: LanguageService,
    private user_Service: UserService
  ) { }

  ngOnInit() {
    this.language_Service._selected_from_service
      .subscribe(date => { this.language = date });
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      formValue.user_id = localStorage.getItem('u324_3i_25d');
      formValue.user_name = localStorage.getItem('u324_n4325e');
      this.user_Service.leaveAcomment(formValue, this.language);
      this.resetForm();
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
