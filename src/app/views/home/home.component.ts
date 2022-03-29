import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OperationResponseI } from 'src/app/models/operationResponse.interface';
import { UserDataResponseI } from 'src/app/models/userDataResponse.interface';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  operations: OperationResponseI[] | undefined;

  constructor(
    private api: ApiService,
    private router: Router,
    private toastrSvc: ToastrService,
  ) { }

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    this.getUserByEmail(email!);
    this.getOperationsForTheLast7DaysByUserEmail(email!);
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

  getOperationsForTheLast7DaysByUserEmail(email: string) {
    this.api.getOperationsForTheLast7DaysByUserEmail(email).subscribe((data) => {
      this.operations = data;
      this.operations.reverse();
      if (this.operations[0] != undefined) {

        console.log(this.operations);
      } else {
        const errorMessage = "Error When fetching Users's operations";
        this.toastrSvc.error(errorMessage);
      }
    },
      err => {
        console.log('HTTP Error', err);
        const errorMessage = "Error When fetching User's operations";
        this.toastrSvc.error(errorMessage);
      });
  }
}
