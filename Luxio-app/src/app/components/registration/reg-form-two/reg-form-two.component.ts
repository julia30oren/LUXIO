import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
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
    name: new FormControl('', Validators.required),
    category: new FormControl(''),
    imageURL: new FormControl('', Validators.required)

  })

  constructor(
    private regService: RegistrationService,
    private firestorage: AngularFireStorage,
    private cert_service: ImageService
  ) { }

  ngOnInit() {
    this.resetForm();
    this.cert_service.getImageDetailList();
  }

  showPreimg(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => { this.imgSrc = e.target.result; };
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImg = event.target.files[0];
    } else {
      this.imgSrc = '../../../../assets/images.png';
      this.selectedImg = null;
    }
  }

  onSubmit(formValue) {
    console.log('submit');
    this.isSubmitted = true;
    console.log(formValue);

    if (this.formTemplate.valid) {
      var filePath = `certificates/certificate:(${formValue.name})_${this.selectedImg.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`
      const fileRef = this.firestorage.ref(filePath);
      this.firestorage
        .upload(filePath, this.selectedImg)
        .snapshotChanges()
        .pipe(finalize(() => {
          fileRef.getDownloadURL()
            .subscribe((url) => {
              formValue['imageURL'] = url;
              this.cert_service.insertImageDetails(formValue);
              this.resetForm();
            })
        }))
        .subscribe();
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      name: '',
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
