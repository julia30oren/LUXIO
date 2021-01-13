import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}
// ------------Navbar Scroll-----
var prevScrollpos = window.pageYOffset;
console.log(prevScrollpos);

window.onscroll = function () {


  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("Header").style.top = "0";
  } else {
    document.getElementById("Header").style.top = "-150px";
  }
  prevScrollpos = currentScrollPos;
}

// -----------------
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
