import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class WhatsappServiseService {

  private URL: string = `${environment.hostURL}:${environment.DBport}`;
  private whatsapp_URL: string = `${this.URL}/whatsapp`;

  constructor(
    private http: HttpClient
  ) { }

  // -----------------------------send whatsapp message to admin-------------------
  whatsapp_toAdmin(message: object) {
    return this.http.post(`${this.whatsapp_URL}`, message).subscribe(res => {
      console.log(res);
    });
  }
}
