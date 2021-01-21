import { Component, OnInit } from '@angular/core';
import { RegistrationService } from './services/registation/registration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { LanguageService } from './services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './services/user-servise/user.service';
import { ShopService } from './services/shop/shop.service';
import { RespondService } from './services/respond/respond.service';
import * as bcrypt from 'bcryptjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public salt = bcrypt.genSaltSync(10);
  public regForm_Open: boolean = false;
  public formOne_Open: boolean = false;
  public formAgreement_Open: boolean = false;
  public formLogin_Open: boolean = false;
  public formPasswodRestore_Open: boolean = false;
  public prodOptionsOpen: boolean;
  public location: string = "";
  public languege: string;
  public user: string;
  public users_props: boolean;
  public cookies: boolean;
  public advertisement: boolean;
  public respond: Array<any> = [];
  public selectedProd: boolean;
  public shop: Array<any>;
  public admin: boolean = false;

  formTemplate = new FormGroup({
    name: new FormControl('', Validators.required),
    termsAgree: new FormControl(false, Validators.required)
  });

  backgroundColor = environment.navBarBackgroundColor;
  constructor(
    private router: Router,
    private respond_Service: RespondService,
    public translate: TranslateService,
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
    console.log(this.backgroundColor)
    this.language_Service.setInitialAppLanguage();
    //------------------------------------detecting location for navbar--------
    this.location = window.location.pathname.substring(1);
    // 
    this.user_Service.user_name_from_service
      .subscribe(date => {
        this.user = date
      });
    // ----
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("Header").style.top = "0";
      } else {
        document.getElementById("Header").style.top = "-150px";
      }
      prevScrollpos = currentScrollPos;
    }
    // --------checking cookies agreement--------
    this.respond_Service.agreementCheck();
    this.respond_Service.userAgreementPolicy_service
      .subscribe(date => {
        this.cookies = date;
        // console.log(this.cookies)
      });
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
    // if user is admin
    this.regestration_Service.admin_from_service
      .subscribe(date => this.admin = date);
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
    this.user_Service.denyAdminEntrance();
  }

  registration_form() {
    this.regestration_Service.open_RegistrationForm();
  }

  login_form() {
    console.log('click')
    if (this.regForm_Open) {
      this.regestration_Service.loginPage();
    } else this.regestration_Service.loginForm();
  }

  passwordRest_form() {
    this.regestration_Service.passwordRestorePage();
  }

  logOut() {
    let hush = localStorage.getItem('cookies_rep_hash');
    localStorage.clear();
    localStorage.setItem('cookies_rep_hash', hush);
  }

  agreeToCookiesPolicy() {
    this.respond_Service.agreementToCookiesPolicy(true);
  }

  close_advertisement() {
    this.advertisement = false;
  }

  // -----------------------------SEARCH FUNCTION------
  // doSearch(search_txt) {
  //   let toSearch = search_txt.toLowerCase();

  //   if (toSearch !== '') {
  //     switch (toSearch) {
  //       case 'luxio':
  //         this.router.navigate(['products/luxio']);
  //         window.scrollTo(0, 0);
  //         break;
  //       case 'options':
  //         this.router.navigate(['products/options']);
  //         window.scrollTo(0, 0);
  //         break;
  //       case 'hard gel':
  //         this.router.navigate(['products/pro-formance']);
  //         window.scrollTo(0, 0);
  //         break;
  //       case 'pro formance':
  //         this.router.navigate(['products/pro-formance']);
  //         window.scrollTo(0, 0);
  //         break;
  //       case 'proformance':
  //         this.router.navigate(['products/pro-formance']);
  //         window.scrollTo(0, 0);
  //         break;
  //       case 'pro-formance':
  //         this.router.navigate(['products/pro-formance']);
  //         window.scrollTo(0, 0);
  //         break;
  //       case 'gel play':
  //         this.router.navigate(['products/gel-play']);
  //         window.scrollTo(0, 0);
  //         break;
  //       case 'gelplay':
  //         this.router.navigate(['products/gel-play']);
  //         window.scrollTo(0, 0)
  //         break;
  //       default:
  //         let index = this.shop[0].findIndex((element) => element.name.toLowerCase() === toSearch); //geting index of item by id
  //         console.log(index)
  //         this.shop_Service.selectProd(index, true); //sending index to server and seting bog-image-component open(true)
  //         break;
  //     }
  //   }
  // }

  // ----------------------seting new location for navbar-----------
  setLocation(location: string) {
    this.location = location;
  }
  // --------------------seting chosen languega--------------
  setLng(languege) {
    this.language_Service.setLanguage(languege);
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