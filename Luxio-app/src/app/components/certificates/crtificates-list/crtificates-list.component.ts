import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/imgService/img-searvice.service';

@Component({
  selector: 'app-crtificates-list',
  templateUrl: './crtificates-list.component.html',
  styleUrls: ['./crtificates-list.component.css']
})
export class CrtificatesListComponent implements OnInit {

  certificatesList: any[];
  // rowIndexArray: any[];

  constructor(
    private cert_service: ImageService
  ) { }

  ngOnInit() {
    this.cert_service.getImageDetailList();
    this.getDate();
  }

  getDate() {
    this.cert_service.imageDetailList
      .snapshotChanges()
      .subscribe(list => {
        // this.certificatesList = list
        this.certificatesList = list.map(item => { console.log(item); return item.payload.val(); });
        // this.rowIndexArray = Array.from(Array(Math.ceil(this.certificatesList.length / 3)).keys())
      })
  }
}
