import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDataResponseI } from 'src/app/models/userDataResponse.interface';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private api: ApiService,
    private router: Router,
    private toastrSvc: ToastrService,
  ) { }

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    this.getUserByEmail(email!);
  }

  getUserByEmail(email: string) {
    this.api.getUserByEmail(email).subscribe((data) => {
      let userData: UserDataResponseI = data;
      if (userData.message == "Successfully got!") {

        console.log(userData);
        this.toastrSvc.success('Welcome ' + userData.firstName + "!");
      } else {
        const errorMessage = "Error When fetching Users's data";
        this.toastrSvc.error(errorMessage);
      }
    },
      err => {
        console.log('HTTP Error', err);
        const errorMessage = "Error When fetching Users's data";
        this.toastrSvc.error(errorMessage);
      });
  }



}
