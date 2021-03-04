import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { WhatsappServiseService } from 'src/app/services/whatsapp/whatsapp-servise.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  public isSubmited1: boolean;
  public isSubmited2: boolean;
  public isSubmited3: boolean;
  public phone: string = '';
  public validPhone1: boolean;
  public validPhone2: boolean;
  public validPhone3: boolean;
  public language: string;

  constructor(
    private lang_service: LanguageService,
    private whatsapp_Service: WhatsappServiseService
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => { this.language = date });
  }

  //Introductory seminars
  contactMe1() {
    this.isSubmited1 = true;
    let whatsappMessage = '';
    let phoneNumber = '+972' + this.phone;
    if (this.phone.length !== 9) {
      this.validPhone1 = false;
    } else {
      this.validPhone1 = true;
      switch (this.language) {
        case 'en':
          whatsappMessage = `✏️ Good day. I want to know more about the *free survey seminar*. Please contact me at ${phoneNumber}`
          break;
        case 'ru':
          whatsappMessage = `✏️ Добрый день. Хочу узнать больше про *бесплатный обзорный семинар*. Пожалуйста свяжитесь со мной по телефону ${phoneNumber}`
          break;
        default:
          whatsappMessage = `✏️ יום טוב. אני רוצה לדעת יותר על *סדנאות היכרות ללא עלות*. אנא צרו איתי קשר בטלפון ${phoneNumber}`
          break;
      };
      this.whatsapp_Service.whatsapp_toAdmin({ say: whatsappMessage }, this.language);
    }
  }

  // Course Manicure-Combi for beginners
  contactMe2() {
    this.isSubmited2 = true;
    let whatsappMessage = '';
    let phoneNumber = '+972' + this.phone;
    if (this.phone.length !== 9) {
      this.validPhone2 = false;
    } else {
      this.validPhone2 = true;
      console.log(phoneNumber);
      switch (this.language) {
        case 'en':
          whatsappMessage = `✏️ Good day. I would like to know more about *MANICURE COMBI course FOR BEGINNERS*. Please contact me at ${phoneNumber}`
          break;
        case 'ru':
          whatsappMessage = `✏️ Добрый день. Хочу узнать больше про *курс МАНИКЮР-КОМБИ ДЛЯ НАЧИНАЮЩИХ*. Пожалуйста свяжитесь со мной по телефону ${phoneNumber}`
          break;
        default:
          whatsappMessage = `✏️ אחר הצהריים טובים. ברצוני לדעת יותר אודות *קורס קומבי למניקור למתחילים*. אנא צרו איתי קשר בטלפון ${phoneNumber}`
          break;
      };
      this.whatsapp_Service.whatsapp_toAdmin({ say: whatsappMessage }, this.language);
    }
  }

  // Course Manicure Combi - Level Up
  contactMe3() {
    this.isSubmited3 = true;
    let whatsappMessage = '';
    let phoneNumber = '+972' + this.phone;
    if (this.phone.length !== 9) {
      this.validPhone3 = false;
    } else {
      this.validPhone3 = true;
      console.log(phoneNumber);
      switch (this.language) {
        case 'en':
          whatsappMessage = `✏️ Good day. I would like to know more about *MANICURE COMBI course FOR BEGINNERS*. Please contact me at ${phoneNumber}`
          break;
        case 'ru':
          whatsappMessage = `✏️ Добрый день. Хочу узнать больше про *курс МАНИКЮР-КОМБИ ДЛЯ НАЧИНАЮЩИХ*. Пожалуйста свяжитесь со мной по телефону ${phoneNumber}`
          break;
        default:
          whatsappMessage = `✏️ אחר הצהריים טובים. ברצוני לדעת יותר אודות *קורס קומבי למניקור למתחילים*. אנא צרו איתי קשר בטלפון ${phoneNumber}`
          break;
      };
      this.whatsapp_Service.whatsapp_toAdmin({ say: whatsappMessage }, this.language);
    }
  }
}
