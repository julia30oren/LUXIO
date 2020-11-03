import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RespondService {

  private respond_fromServer = new BehaviorSubject<Array<any>>([]);
  public respond_fromServer_service = this.respond_fromServer.asObservable();

  constructor() { }

  saveRespond(respond: any) {
    console.log(respond)
    this.respond_fromServer.next(respond);
  }

}
