import { Component, OnInit } from '@angular/core';
import { WhatsappServiseService } from 'src/app/services/whatsapp/whatsapp-servise.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  public phone1: boolean;

  constructor(
    private whatsapp_Service: WhatsappServiseService
  ) { }

  ngOnInit() {
  }

  contactMe1(val) {
    if (11 >= val.length && val.length >= 9) {
      console.log(val)
    } else this.phone1 = false;
  }
}
