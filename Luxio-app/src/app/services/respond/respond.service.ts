import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { RegistrationService } from '../registation/registration.service';

@Injectable({
  providedIn: 'root'
})
export class RespondService {

  private salt = bcrypt.genSaltSync(10);

  private respond_fromServer = new BehaviorSubject<Array<any>>([]);
  public respond_fromServer_service = this.respond_fromServer.asObservable();

  private userAgreementPolicy = new BehaviorSubject<boolean>(localStorage.getItem('cookies_rep_hash') ? true : false);
  public userAgreementPolicy_service = this.userAgreementPolicy.asObservable();

  constructor(
    private regestration_Service: RegistrationService
  ) { }

  saveRespond(respond: any) {
    this.respond_fromServer.next(respond);
  }

  agreementCheck() {
    let hush = localStorage.getItem('cookies_rep_hash');
    if (hush) {
      const cryptoAgreementChek = bcrypt.compareSync('true', hush);

      if (cryptoAgreementChek) {
        this.userAgreementPolicy.next(true);
      } else this.userAgreementPolicy.next(false);
    } else this.userAgreementPolicy.next(false);

  }

  agreementToCookiesPolicy(state: boolean) {
    if (state) {
      const agreementHash = bcrypt.hashSync(JSON.stringify(state), this.salt);
      localStorage.setItem('cookies_rep_hash', agreementHash);
    } else localStorage.removeItem('cookies_rep_hash');
    this.userAgreementPolicy.next(state);
    // to close agreement page -------------state=false
    this.regestration_Service.AgreementPage(false);
  }



}
