import { Component, OnInit } from '@angular/core';
import { RegistrationService } from './services/registation/registration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { SaveUserService } from './services/saveUser/save-user.service';
import { LanguageService } from './services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './services/user-servise/user.service';
import { ShopService } from './services/shop/shop.service';
import { RespondService } from './services/respond/respond.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public regForm_Open: boolean = false;
  public formOne_Open: boolean = false;
  public formAgreement_Open: boolean = false;
  public formLogin_Open: boolean = false;
  public formPasswodRestore_Open: boolean = false;
  public prodOptionsOpen: boolean;
  private location: string = "";
  public languege: string;
  public user: string;
  public users_props: boolean;
  public cookies: boolean = true;
  public advertisement: boolean;
  public respond: Array<any> = [];
  public selectedProd: boolean;
  public shop: Array<any>;

  formTemplate = new FormGroup({
    name: new FormControl('', Validators.required),
    termsAgree: new FormControl(false, Validators.required)
  });

  constructor(
    private router: Router,
    private respond_Service: RespondService,
    private translate: TranslateService,
    private language_Service: LanguageService,
    private regestration_Service: RegistrationService,
    private shop_Service: ShopService,
    private user_Service: UserService

  ) {
    translate.addLangs(['en', 'ru', 'iv']);
    translate.setDefaultLang('en');
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ru|iv/) ? browserLang : 'en');
  }


  ngOnInit() {
    // ------------------------------
    this.shop_Service.getProducts_fromDB();
    this.shop_Service.shop_products_from_service
      .subscribe(date => { this.shop = date })
    // ------------------------------timer for advertisement (after 30 sec.)-----
    window.setTimeout(() => {
      if (!this.user && !this.regForm_Open) {
        this.advertisement = true;
      }
    }, 30000);
    //------------------------------------detecting location for navbar--------
    this.location = window.location.pathname.substring(1);
    // ----------------------------------------language setings----
    this.language_Service.setInitialAppLanguage();
    this.language_Service._selected_from_service
      .subscribe(date => this.languege = date);//subscribing for languege
    // -------------------------------------------------------------------------------------
    this.respond_Service.respond_fromServer_service
      .subscribe(date => {
        this.respond = date; // [ { "status": true, "message": "Спасибо за ваш комментарий. Он был успешно сохранен." } ]
        window.setTimeout(() => {
          this.respond = [];
        }, 5000);
      })


    // -------------------------------------------REGISTRATION SETINGS-----------
    this.regestration_Service.regestrationForm_from_service
      .subscribe(data => {
        this.regForm_Open = data;
      });
    this.regestration_Service.regestration_formOne_from_service
      .subscribe(data => {
        this.formOne_Open = data;
      });
    this.regestration_Service.regestration_formAgreement_from_service
      .subscribe(data => {
        this.formAgreement_Open = data;
      });
    this.regestration_Service.login_form_from_service
      .subscribe(data => {
        this.formLogin_Open = data;
      });
    this.regestration_Service.passwordRestore_form_from_service
      .subscribe(data => {
        this.formPasswodRestore_Open = data;
      });
    // -----------------------------
    this.user_Service.user_name_from_service
      .subscribe(date => {
        this.user = date
      });


    // -------------------------------------
    this.shop_Service.select_one_from_service
      .subscribe(date => this.selectedProd = date);
  }

  // --------------------seting chosen languega--------------
  setLng(languege) {
    this.language_Service.setLanguage(languege);
  }
  // ----------------------seting new location for navbar-----------
  setLocation(location: string) {
    this.location = location;
  }
  // ----------------------------------------




  usersPropertise() {
    this.users_props = !this.users_props;
  }

  openProdOptions() {
    this.prodOptionsOpen = !this.prodOptionsOpen;
  }

  openForm() {
    this.registration_form();
  }

  closeForm() {
    this.regestration_Service.close_RegistrationForm();
  }

  registration_form() {
    this.regestration_Service.open_RegistrationForm();
  }

  login_form() {
    if (this.regForm_Open) {
      this.regestration_Service.loginPage();
    } else this.regestration_Service.loginForm();
  }

  passwordRest_form() {
    this.regestration_Service.passwordRestorePage();
  }

  logOut() {
    localStorage.clear();
  }

  close_advertisementCookies() {
    this.cookies = false;
  }

  close_advertisement() {
    this.advertisement = false;
  }

  // -----------------------------SEARCH FUNCTION------
  doSearch(search_txt) {
    if (search_txt !== '') {
      // console.log(search_txt);
      switch (search_txt.toLowerCase()) {
        case 'luxio':
          this.router.navigate(['products/luxio']);
          window.scrollTo(0, 0)
          break;
        case 'options':
          this.router.navigate(['products/options']);
          window.scrollTo(0, 0)
          break;
        case 'hard gel':
          this.router.navigate(['products/pro-formance']);
          window.scrollTo(0, 0)
          break;
        case 'pro formance':
          this.router.navigate(['products/pro-formance']);
          window.scrollTo(0, 0)
          break;
        case 'proformance':
          this.router.navigate(['products/pro-formance']);
          window.scrollTo(0, 0)
          break;
        case 'pro-formance':
          this.router.navigate(['products/pro-formance']);
          window.scrollTo(0, 0)
          break;
        case 'gel play':
          this.router.navigate(['products/gel-play']);
          window.scrollTo(0, 0)
          break;
        case 'gelplay':
          this.router.navigate(['products/gel-play']);
          window.scrollTo(0, 0)
          break;
        default:
          this.shop[0].forEach(element => {
            if (element.name.toLowerCase().includes(search_txt)) {
              console.log(element)
              this.shop_Service.selectProd(element, true);
            }
          });
          break;
      }
    }
  }

}