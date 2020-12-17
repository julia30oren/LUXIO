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

  private userAgreementPolicy = new BehaviorSubject<boolean>(false);
  public userAgreementPolicy_service = this.userAgreementPolicy.asObservable();

  constructor(
    private regestration_Service: RegistrationService
  ) { }

  saveRespond(respond: any) {
    console.log(respond);
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
    const agreementHash = bcrypt.hashSync(JSON.stringify(state), this.salt);
    console.log(state)
    localStorage.setItem('cookies_rep_hash', agreementHash);
    this.userAgreementPolicy.next(state);
    this.regestration_Service.close_AgreementPage();
  }

}
