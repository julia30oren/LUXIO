import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhatsappServiseService {

  private whatsapp_URL: string = 'http://localhost:5000/whatsapp';


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
