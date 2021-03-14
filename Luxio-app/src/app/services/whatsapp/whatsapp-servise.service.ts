import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RespondService } from '../respond/respond.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsappServiseService {

  private whatsapp_URL: string = `${environment.hostURL}:${environment.DBport}/whatsapp`;

  constructor(
    private http: HttpClient,
    private respond_Service: RespondService
  ) { }

  // -----------------------------send whatsapp message to admin-------------------
  whatsapp_toAdmin(message: object, lang: string) {
    return this.http.post(`${this.whatsapp_URL}/${lang}`, message).subscribe(res => {
      this.respond_Service.saveRespond(res);
    });
  }
}
