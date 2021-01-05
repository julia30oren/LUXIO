import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { WhatsappServiseService } from 'src/app/services/whatsapp/whatsapp-servise.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  public phone1: boolean;
  public languege: string;

  constructor(
    private lang_service: LanguageService,
    private whatsapp_Service: WhatsappServiseService
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });
  }

  //Introductory seminars
  contactMe1(val) {
    if (11 >= val.length && val.length >= 9) {
      console.log(val)
    } else this.phone1 = false;
  }
  // Course Manicure-Combi for beginners
  contactMe2(val) {
    if (11 >= val.length && val.length >= 9) {
      console.log(val)
    } else this.phone1 = false;
  }
  // Course Manicure Combi - Level Up
  contactMe3(val) {
    if (11 >= val.length && val.length >= 9) {
      console.log(val)
    } else this.phone1 = false;
  }
}
