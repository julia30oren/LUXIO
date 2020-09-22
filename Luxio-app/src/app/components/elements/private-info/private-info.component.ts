import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-servise/user.service';

@Component({
  selector: 'app-private-info',
  templateUrl: './private-info.component.html',
  styleUrls: ['./private-info.component.css']
})
export class PrivateInfoComponent implements OnInit {
  private user: Array<any>;

  constructor(
    private user_service: UserService
  ) { }

  ngOnInit() {
    this.user_service.getUser(localStorage.getItem('u324_3i_25d'));

    this.user_service.user_full_from_service
      .subscribe(date => this.user = date)
  }

}
