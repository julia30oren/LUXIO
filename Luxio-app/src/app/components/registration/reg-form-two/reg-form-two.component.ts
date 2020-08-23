import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImageService } from 'src/app/services/imgService/img-searvice.service';
import { RegistrationService } from 'src/app/services/registation/registration.service';

@Component({
  selector: 'app-reg-form-two',
  templateUrl: './reg-form-two.component.html',
  styleUrls: ['./reg-form-two.component.css']
})
export class RegFormTwoComponent implements OnInit {

  imgSrc: string;
  selectedImg: any = null;
  isSubmitted: boolean;

  formTemplate = new FormGroup({
    category: new FormControl(''),
    imageURL: new FormControl('', Validators.required)
  })

  constructor(
    private regService: RegistrationService,
    private cert_service: ImageService,

  ) { }

  ngOnInit() {
    this.resetForm();
  }

  showPreimg(event: any) {
    if (event.target.files && event.target.files[0]) {

      // image prevue
      const reader = new FileReader();
      reader.onload = (e: any) => { this.imgSrc = e.target.result; };
      reader.readAsDataURL(event.target.files[0]);
      this.imgSrc = event.target.files[0];

      // image file
      let file = event.target.files[0];
      let formData = new FormData();
      formData.append('image', file);

      this.selectedImg = formData;
    }
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    this.cert_service.insertImageDetails(this.selectedImg, formValue);

    this.resetForm();
    this.regService.close_RegistrationForm();
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      imageURL: '',
      category: ''
    });
    this.imgSrc = '../../../../assets/images.png';
    this.isSubmitted = false;
    this.selectedImg = null;
  }

  previousPage() {
    this.regService.Page1_RegistrationForm();
  }

}
