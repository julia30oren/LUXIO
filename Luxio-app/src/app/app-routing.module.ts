import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrtificatesListComponent } from './components/certificates/crtificates-list/crtificates-list.component';
import { CrtificateUploadComponent } from './components/certificates/crtificate-upload/crtificate-upload.component';
import { HomeComponent } from './components/main/home/home.component';
import { PageNotFoundComponent } from './components/main/page-not-found/page-not-found.component';
import { ContactsComponent } from './components/main/contacts/contacts.component';
import { CoursesComponent } from './components/main/courses/courses.component';
import { SignInComponent } from './components/main/sign-in/sign-in.component';
import { ShopComponent } from './components/main/shop/shop.component';
import { AdminShopComponent } from './components/admin/admin-shop/admin-shop.component';

const routes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },

    { path: 'welcome', component: HomeComponent },
    { path: 'registration', component: SignInComponent },
    { path: "certificate-upload", component: CrtificateUploadComponent },
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
    HomeComponent,
    ShopComponent,
    CrtificateUploadComponent,
    ShopComponent,
    CoursesComponent,
    ContactsComponent,
    CrtificatesListComponent,
    PageNotFoundComponent,
    SignInComponent,
    AdminShopComponent
]