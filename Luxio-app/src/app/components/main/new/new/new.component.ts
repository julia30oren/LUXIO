import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  private langIv: boolean;
  private shadesOpen: boolean;
  private voyageOpen: boolean;
  private fascinationOpen: boolean;
  public my_cart: Array<any> = JSON.parse(localStorage.getItem('my_764528_ct')) || [];
  public my_favorites: Array<any> = JSON.parse(localStorage.getItem('my_764528_f')) || [];
  public shaides: Array<any> = [
    {
      img_link: "https://i.pinimg.com/originals/ae/39/20/ae3920e43086a631797af177426db115.jpg",
      prod_class: "Hard GEL",
      name: "TRINITY WARM",
      price: 100
    },
    {
      img_link: "https://i.pinimg.com/originals/7a/a5/04/7aa5044c0e08d7ad1b04cd9161337c06.jpg",
      prod_class: "Hard GEL",
      name: "TRINITY NATURAL",
      price: 100
    },
    {
      img_link: "https://i.pinimg.com/originals/64/61/7a/64617a0913932eba65ef3b730b8aff95.jpg",
      prod_class: "Hard GEL",
      name: "TRINITY WARM",
      price: 100
    }
  ];
  public voyage: Array<any> = [
    {
      img_link: "https://akzentz.com/wp-content/uploads/2020/01/luxio-lustful-1.jpg",
      prod_class: "Luxio",
      name: "LUSTFUL",
      price: 117
    },
    {
      img_link: "https://akzentz.com/wp-content/uploads/2020/01/luxio-instinct-1.jpg",
      prod_class: "Luxio",
      name: "INSTINCT",
      price: 117
    },
    {
      img_link: "https://akzentz.com/wp-content/uploads/2020/01/luxio-jaded-1.jpg",
      prod_class: "Luxio",
      name: "JADED",
      price: 117
    },
    {
      img_link: "https://akzentz.com/wp-content/uploads/2020/01/luxio-persuasion-1.jpg",
      prod_class: "Luxio",
      name: "PERSUASION",
      price: 117
    },
    {
      img_link: "https://akzentz.com/wp-content/uploads/2020/01/luxio-glimpse-1.jpg",
      prod_class: "Luxio",
      name: "GLIMPSE",
      price: 117
    },
    {
      img_link: "https://akzentz.com/wp-content/uploads/2020/01/luxio-virtue-1.jpg",
      prod_class: "Luxio",
      name: "VIRTUE",
      price: 117
    }
  ];
  public fascination: Array<any> = [
    {
      img_link: "https://akzentz.com/wp-content/uploads/2019/09/luxio-gel-impulse.jpg",
      prod_class: "Luxio",
      name: "IMPULSE",
      price: 117
    },
    {
      img_link: "https://akzentz.com/wp-content/uploads/2019/09/luxio-gel-curiosity.jpg",
      prod_class: "Luxio",
      name: "CUROSITY",
      price: 117
    },
    {
      img_link: "https://akzentz.com/wp-content/uploads/2019/09/luxio-gel-beguiling.jpg",
      prod_class: "Luxio",
      name: "BEGUILING",
      price: 117
    },
    {
      img_link: "https://akzentz.com/wp-content/uploads/2019/09/luxio-gel-tantalizing.jpg",
      prod_class: "Luxio",
      name: "TANTALIZING",
      price: 117
    },
    {
      img_link: "https://akzentz.com/wp-content/uploads/2019/09/luxio-gel-storm.jpg",
      prod_class: "Luxio",
      name: "STORM",
      price: 117
    },
    {
      img_link: "https://akzentz.com/wp-content/uploads/2019/09/luxio-gel-plush.jpg",
      prod_class: "Luxio",
      name: "PLUSH",
      price: 117
    }
  ];

  constructor(
    private lang_service: LanguageService
  ) { }

  ngOnInit() {
    this.lang_service._selected_from_service
      .subscribe(date => {
        if (date === 'iv') {
          this.langIv = true;
        } else this.langIv = false;
        // console.log(date)
      })
  }

  openShades_shop() {
    this.shadesOpen = !this.shadesOpen;
  }

  openVoyage_shop() {
    this.voyageOpen = !this.voyageOpen;
  }

  openFascination_shop() {
    this.fascinationOpen = !this.fascinationOpen;
  }

  getClasses(id) {
    if (this.my_favorites.includes(id)) {
      return 'hart-button red-hart';
    } else return 'hart-button grey-hart';
  }

  getCartClasse(id) {
    if (this.my_cart.includes(id)) {
      return 'cart-button active';
    } else return 'cart-button not-active';
  }
}
