import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  // private cart = localStorage.getItem('u_6946123_c') ? JSON.parse(localStorage.getItem('u_6946123_c')) : [];

  private regestrationForm = new BehaviorSubject<boolean>(false);
  public regestrationForm_from_service = this.regestrationForm.asObservable();

  private regestration_formOne = new BehaviorSubject<boolean>(false);
  public regestration_formOne_from_service = this.regestration_formOne.asObservable();

  private regestration_formTwo = new BehaviorSubject<boolean>(false);
  public regestration_formTwo_from_service = this.regestration_formTwo.asObservable();

  private regestration_formAgreement = new BehaviorSubject<boolean>(false);
  public regestration_formAgreement_from_service = this.regestration_formAgreement.asObservable();

  constructor() { }

  open_RegistrationForm() {
    this.regestrationForm.next(true);
    this.Page1_RegistrationForm();
  }

  Page1_RegistrationForm() {
    this.regestration_formOne.next(true);
    this.regestration_formTwo.next(false);
  }

  Page2_RegistrationForm() {
    this.regestration_formOne.next(false);
    this.regestration_formTwo.next(true);
  }

  AgreementPage() {
    this.regestration_formAgreement.next(true);
  }

  close_AgreementPage() {
    this.regestration_formAgreement.next(false);
    this.Page1_RegistrationForm();
  }

  close_RegistrationForm() {
    this.regestrationForm.next(false);
    this.regestration_formOne.next(false);
    this.regestration_formTwo.next(false);
    this.regestration_formAgreement.next(false);
  }
}
