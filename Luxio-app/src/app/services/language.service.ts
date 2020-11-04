import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';


const LNG_KEY = 'SELECTED_LANGUAGE'

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';

  private _selected = new BehaviorSubject<string>(this.translate.getBrowserLang().match(/en|ru|iv/) ? this.translate.getBrowserLang() : 'eng');
  public _selected_from_service = this._selected.asObservable();

  constructor(
    private translate: TranslateService,
    private storage: Storage
  ) { }

  setInitialAppLanguage() {
    // const browserLang = this.translate.getBrowserLang();
    // this.translate.use(browserLang.match(/en|ru|iv/) ? browserLang : 'en');

    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    this.storage.get(LNG_KEY).then(val => {
      if (val) {
        this.setLanguage(val);
        this._selected.next(val);
      }
    });
  }

  getLanguages() {
    return [
      { text: 'English', val: 'en' },
      { text: 'Russian', val: 'ru' },
      { text: 'Hebrew', val: 'iv' }
    ]
  }

  setLanguage(lng) {
    this.translate.use(lng);
    this._selected.next(lng);
    this.storage.set(LNG_KEY, lng);
    this.selected = lng;
    // console.log(this.selected)
  }


}
