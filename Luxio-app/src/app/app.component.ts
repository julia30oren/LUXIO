import { Component, OnInit } from '@angular/core';
import { RegistrationService } from './services/registation/registration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { SaveUserService } from './services/saveUser/save-user.service';
import { LanguageService } from './services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './services/user-servise/user.service';
import { ShopService } from './services/shop/shop.service';

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

  formTemplate = new FormGroup({
    name: new FormControl('', Validators.required),
    termsAgree: new FormControl(false, Validators.required)
  });

  constructor(
    private regService: RegistrationService,
    private usersServ: SaveUserService,
    private languageService: LanguageService,
    public translate: TranslateService,
    private user_serv: UserService,
    private shop_service: ShopService,
    private router: Router
  ) {
    translate.addLangs(['en', 'ru', 'iv']);
    translate.setDefaultLang('en');

    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ru|iv/) ? browserLang : 'en');
  }


  ngOnInit() {
    window.setTimeout(() => {
      if (!this.user && !this.regForm_Open) {
        this.advertisement = true;
      }
    }, 30000)

    this.languageService.setInitialAppLanguage();
    this.regService.regestrationForm_from_service
      .subscribe(data => {
        this.regForm_Open = data;
      });
    this.regService.regestration_formOne_from_service
      .subscribe(data => {
        this.formOne_Open = data;
      });

    this.regService.regestration_formAgreement_from_service
      .subscribe(data => {
        this.formAgreement_Open = data;
      });
    this.regService.login_form_from_service
      .subscribe(data => {
        this.formLogin_Open = data;
      });
    this.regService.passwordRestore_form_from_service
      .subscribe(data => {
        this.formPasswodRestore_Open = data;
      });

    this.user_serv.user_name_from_service
      .subscribe(date => {
        this.user = date
      })

    this.languageService._selected_from_service
      .subscribe(date => this.languege = date)

    this.location = window.location.pathname.substring(1);
  }

  usersPropertise() {
    this.users_props = !this.users_props;
  }

  setLocation(loc: string) {
    this.location = loc;
  }

  openProdOptions() {
    this.prodOptionsOpen = !this.prodOptionsOpen;
  }

  setLng(l) {
    this.languageService.setLanguage(l);
  }

  getUsers() {
    // console.log('click from user');
    this.usersServ.getUsers_fromDB();
  }

  openForm() {
    this.registration_form();
  }

  closeForm() {
    this.regService.close_RegistrationForm();
  }

  registration_form() {
    this.regService.open_RegistrationForm();
  }

  login_form() {
    if (this.regForm_Open) {
      this.regService.loginPage();
    } else this.regService.loginForm();
  }

  passwordRest_form() {
    this.regService.passwordRestorePage();
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

  doSearch(search_txt) {
    if (search_txt !== '') {
      // console.log(search_txt)
      this.shop_service.getProducts_fromDB();

      this.shop_service.shop_products_from_service
        .subscribe(date => {
          let shop = date[0];
          // 
          if (shop) {

            shop.forEach(element => {
              if (element.name.includes(search_txt)) {
                console.log(element)
                this.shop_service.selectProd(element, true);
                this.router.navigate(['/search', search_txt]);
              }
            });
          }
        });
    }

  }

}