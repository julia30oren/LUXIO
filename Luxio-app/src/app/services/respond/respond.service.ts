import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RegistrationService } from '../registation/registration.service';

@Injectable({
  providedIn: 'root'
})
export class RespondService {

  private respond_fromServer = new BehaviorSubject<Array<any>>([]);
  public respond_fromServer_service = this.respond_fromServer.asObservable();

  private userAgreementPolicy = new BehaviorSubject<boolean>(localStorage.getItem('cookies_rep_hash') ? JSON.parse(localStorage.getItem('cookies_rep_hash')) : false);
  public userAgreementPolicy_service = this.userAgreementPolicy.asObservable();

  constructor(
    private regestration_Service: RegistrationService
  ) { }

  saveRespond(respond: any) {
    this.respond_fromServer.next(respond);
  }

  agreementToCookiesPolicy(state: boolean) {
    localStorage.setItem('cookies_rep_hash', JSON.stringify(state));
    this.userAgreementPolicy.next(state);
    // to close agreement page -------------state=false
    this.regestration_Service.AgreementPage(false);
  }

}