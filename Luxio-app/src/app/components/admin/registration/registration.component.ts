import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { LanguageService } from 'src/app/services/language.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public languege: string;
  public isSubmitted: boolean;
  public formTemplate = new FormGroup({
    email: new FormControl('', Validators.required),
    main_password: new FormControl('', Validators.required),
    admin_name: new FormControl('', Validators.required),
    admin_password: new FormControl('', Validators.required)
  })

  constructor(
    private lang_service: LanguageService,
    private admin_Service: AdminServiceService
  ) { }

  ngOnInit() {
    // -------------------------------------------subscribing for languege 
    this.lang_service._selected_from_service
      .subscribe(date => this.languege = date);
    // ------------------------------------------subscribing for comments
    // this.admin_Service.getAdmins_fromDB();
    // this.admin_Service.admins_from_service
    //   .subscribe(date => this.allAdmins = date);
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      console.log(formValue);
    } else {
      console.log('denied');
    }
  }
}
