import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private regestrationForm = new BehaviorSubject<boolean>(false);
  public regestrationForm_from_service = this.regestrationForm.asObservable();

  private regestration_formOne = new BehaviorSubject<boolean>(false);
  public regestration_formOne_from_service = this.regestration_formOne.asObservable();

  private regestration_formTwo = new BehaviorSubject<boolean>(false);
  public regestration_formTwo_from_service = this.regestration_formTwo.asObservable();

  private regestration_formAgreement = new BehaviorSubject<boolean>(false);
  public regestration_formAgreement_from_service = this.regestration_formAgreement.asObservable();

  private conditions_of_use = new BehaviorSubject<boolean>(undefined);
  public conditions_of_use_from_service = this.conditions_of_use.asObservable();

  private login_form = new BehaviorSubject<boolean>(false);
  public login_form_from_service = this.login_form.asObservable();

  private passwordRestore_form = new BehaviorSubject<boolean>(false);
  public passwordRestore_form_from_service = this.passwordRestore_form.asObservable();

  constructor() { }

  open_RegistrationForm() {
    this.regestrationForm.next(true);
    this.Page1_RegistrationForm();
  }

  Page1_RegistrationForm() {
    this.passwordRestore_form.next(false);
    this.login_form.next(false);
    this.regestration_formTwo.next(false);
    this.regestration_formOne.next(true);
  }

  AgreementPage() {
    this.regestration_formAgreement.next(true);
  }

  user_agree_with_terms(yesORno: boolean) {
    this.conditions_of_use.next(yesORno);
    this.close_AgreementPage();
  }

  close_AgreementPage() {
    this.regestration_formAgreement.next(false);
    this.Page1_RegistrationForm();
  }

  loginForm() {
    this.regestrationForm.next(true);
    this.loginPage();
  }

  loginPage() {
    this.regestration_formOne.next(false);
    this.regestration_formTwo.next(false);
    this.regestration_formAgreement.next(false);
    this.passwordRestore_form.next(false);
    this.login_form.next(true);
  }

  passwordRestorePage() {
    this.regestration_formOne.next(false);
    this.regestration_formTwo.next(false);
    this.regestration_formAgreement.next(false);
    this.login_form.next(false);
    this.passwordRestore_form.next(true);
  }

  close_RegistrationForm() {
    this.regestrationForm.next(false);
    this.regestration_formOne.next(false);
    this.regestration_formTwo.next(false);
    this.regestration_formAgreement.next(false);
    this.login_form.next(false);
  }
}
