import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
// import { CarouselModule, WavesModule } from 'angular-bootstrap-md';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('comersial', { static: false }) public comersial: ElementRef;

  public languege: string;
  public play: boolean = true;
  public sound: boolean = true;

  constructor(
    private lang_service: LanguageService,
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => { this.languege = date });
  }

  ngAfterViewInit() {
    this.comersial.nativeElement.play();
    this.comersial.nativeElement.autoplay = !this.comersial.nativeElement.autoplay;
  }

  playPause() {
    if (!this.comersial.nativeElement.autoplay) this.comersial.nativeElement.play();
    else this.comersial.nativeElement.pause();
    this.comersial.nativeElement.autoplay = !this.comersial.nativeElement.autoplay;
    this.play = !this.play;
  }

  soundOnOff() {
    this.comersial.nativeElement.muted = !this.comersial.nativeElement.muted;
    this.sound = !this.sound;
  }

}
