import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { RegistrationService } from 'src/app/services/registation/registration.service';
import { UserService } from 'src/app/services/user-servise/user.service';
import { Router } from "@angular/router"
import { ShopService } from 'src/app/services/shop/shop.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public location: string = "";
  private admin: boolean = false;
  public user: string;
  public shop: Array<any>;

  constructor(
    private router: Router,
    private user_Service: UserService,
    private regestration_Service: RegistrationService,
    private translate: TranslateService,
    private shop_Service: ShopService,
    private language_Service: LanguageService
  ) {
    translate.addLangs(['en', 'ru', 'iv']);
    translate.setDefaultLang('en');
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ru|iv/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.language_Service.setInitialAppLanguage();
    //------------------------------------detecting location for navbar--------
    this.location = window.location.pathname.substring(1);
    // 
    this.user_Service.user_name_from_service
      .subscribe(date => {
        this.user = date
      });
    // if user is admin
    this.regestration_Service.admin_from_service
      .subscribe(date => this.admin = date);
    // ----
    this.shop_Service.getProducts_fromDB();
    this.shop_Service.shop_products_from_service
      .subscribe(date => { this.shop = date });
  }

  // ----------------------seting new location for navbar-----------
  setLocation(location: string) {
    this.location = location;
  }
  // --------------------seting chosen languega--------------
  setLng(languege) {
    this.language_Service.setLanguage(languege);
  }

  logOut() {
    let hush = localStorage.getItem('cookies_rep_hash');
    localStorage.clear();
    localStorage.setItem('cookies_rep_hash', hush);
  }

  getRegistrationForm() {
    console.log('reg')
    this.regestration_Service.loginForm();
  }
  // -----------------------------SEARCH FUNCTION------
  doSearch(search_txt) {
    let toSearch = search_txt.toLowerCase();
    console.log(toSearch);
    if (toSearch !== '') {
      switch (toSearch) {
        case 'luxio':
          this.router.navigate(['products/luxio']);
          window.scrollTo(0, 0);
          break;
        case 'options':
          this.router.navigate(['products/options']);
          window.scrollTo(0, 0);
          break;
        case 'hard gel':
          this.router.navigate(['products/pro-formance']);
          window.scrollTo(0, 0);
          break;
        case 'pro formance':
          this.router.navigate(['products/pro-formance']);
          window.scrollTo(0, 0);
          break;
        case 'proformance':
          this.router.navigate(['products/pro-formance']);
          window.scrollTo(0, 0);
          break;
        case 'pro-formance':
          this.router.navigate(['products/pro-formance']);
          window.scrollTo(0, 0);
          break;
        case 'gel play':
          this.router.navigate(['products/gel-play']);
          window.scrollTo(0, 0);
          break;
        case 'gelplay':
          this.router.navigate(['products/gel-play']);
          window.scrollTo(0, 0)
          break;
        default:
          let index = this.shop[0].findIndex((element) => element.name.toLowerCase() === toSearch); //geting index of item by id
          console.log(index)
          this.shop_Service.selectProd(index, true); //sending index to server and seting bog-image-component open(true)
          break;
      }
    }
  }
}
