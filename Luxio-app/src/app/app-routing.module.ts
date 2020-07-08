import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrtificatesListComponent } from './components/certificates/crtificates-list/crtificates-list.component';
import { CrtificateUploadComponent } from './components/certificates/crtificate-upload/crtificate-upload.component';

const routes: Routes = [
    { path: "certificates", component: CrtificatesListComponent },
    { path: "certificate-upload", component: CrtificateUploadComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { } 