import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrtificatesListComponent } from './components/certificates/crtificates-list/crtificates-list.component';
import { PageNotFoundComponent } from './components/main/page-not-found/page-not-found.component';
import { ContactsComponent } from './components/main/contacts/contacts.component';
import { CoursesComponent } from './components/main/courses/courses.component';
import { SignInComponent } from './components/main/sign-in/sign-in.component';
import { ShopComponent } from './components/main/shop/shop.component';
import { AdminShopComponent } from './components/admin/admin-shop/admin-shop.component';
import { NewComponent } from './components/main/new/new.component';
import { BasicsComponent } from './components/main/products/basics/basics.component';
import { GelPlayComponent } from './components/main/products/gel-play/gel-play.component';
import { LuxioComponent } from './components/main/products/luxio/luxio.component';
import { OptionssComponent } from './components/main/products/optionss/optionss.component';
import { ProFormanceComponent } from './components/main/products/pro-formance/pro-formance.component';
import { ToolsComponent } from './components/main/products/tools/tools.component';
import { PersonalAreaComponent } from './components/personal-area/personal-area.component';
import { CommentsComponent } from './components/admin/comments/comments.component';
import { CookiesComponent } from './components/cookies/cookies.component';
import { RegistrationComponent } from './components/admin/registration/registration.component';
import { RemoveComponent } from './components/admin/remove/remove.component';
import { MailingsComponent } from './components/admin/mailings/mailings.component';
import { HomeComponent } from './components/main/home/home.component';
import { OrdersComponent } from './components/admin/orders/orders.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'new', component: NewComponent },
    { path: 'products/luxio', component: LuxioComponent },
    { path: 'products/options', component: OptionssComponent },
    { path: 'products/gel-play', component: GelPlayComponent },
    { path: 'products/pro-formance', component: ProFormanceComponent },
    { path: 'products/basics', component: BasicsComponent },
    { path: 'products/tools', component: ToolsComponent },
    { path: 'registration', component: SignInComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'courses', component: CoursesComponent },
    { path: 'contacts', component: ContactsComponent },
    { path: 'personal-area', component: PersonalAreaComponent },

    { path: "admin/certificates", component: CrtificatesListComponent },
    { path: "admin/orders", component: OrdersComponent },
    { path: "admin/comments", component: CommentsComponent },
    { path: "admin/shop", component: AdminShopComponent },
    { path: "admin/mailings", component: MailingsComponent },
    { path: "admin/registration", component: RegistrationComponent },
    { path: "admin/remove", component: RemoveComponent },

    { path: 'cookies', component: CookiesComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { };
export const routingComponents = [
    HomeComponent,
    SignInComponent,
    ShopComponent,
    CoursesComponent,
    ContactsComponent,
    NewComponent,
    CrtificatesListComponent,
    GelPlayComponent,
    OptionssComponent,
    ToolsComponent,
    LuxioComponent,
    ProFormanceComponent,
    BasicsComponent,
    AdminShopComponent,
    OrdersComponent,
    MailingsComponent,
    RemoveComponent,
    CommentsComponent,
    RegistrationComponent,
    CookiesComponent,
    PageNotFoundComponent
]