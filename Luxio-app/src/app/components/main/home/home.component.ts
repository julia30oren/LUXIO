import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
// import { CarouselModule, WavesModule } from 'angular-bootstrap-md';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public languege: string;

  constructor(
    private lang_service: LanguageService,
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });
  }

}
