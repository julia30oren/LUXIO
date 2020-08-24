import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrtificatesListComponent } from './components/certificates/crtificates-list/crtificates-list.component';
import { PageNotFoundComponent } from './components/main/page-not-found/page-not-found.component';
import { ContactsComponent } from './components/main/contacts/contacts.component';
import { CoursesComponent } from './components/main/courses/courses.component';
import { SignInComponent } from './components/main/sign-in/sign-in.component';
import { ShopComponent } from './components/main/shop/shop.component';
import { AdminShopComponent } from './components/admin/admin-shop/admin-shop.component';
import { NewComponent } from './components/main/new/new/new.component';

const routes: Routes = [
    { path: '', redirectTo: 'new', pathMatch: 'full' },

    { path: 'new', component: NewComponent },


    { path: 'registration', component: SignInComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'courses', component: CoursesComponent },
    { path: 'contacts', component: ContactsComponent },
    { path: "admin/certificates", component: CrtificatesListComponent },
    { path: "admin/shop", component: AdminShopComponent },

    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { };
export const routingComponents = [
    SignInComponent,
    ShopComponent,
    CoursesComponent,
    ContactsComponent,
    NewComponent,
    CrtificatesListComponent,
    AdminShopComponent,
    PageNotFoundComponent
]