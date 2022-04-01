import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { OperationResponseI } from 'src/app/models/operationResponse.interface';
import { UserDataResponseI } from 'src/app/models/userDataResponse.interface';
import { ApiService } from 'src/app/services/api/api.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userData!: UserDataResponseI;
  lastOperationRadioId: string = ""

  userLastOperations!: OperationResponseI[];
  // testEmitter$ = new EventEmitter<OperationResponseI[] | undefined>(this.userLastOperations);
  userLastOperationsObs: BehaviorSubject<OperationResponseI[]> = new BehaviorSubject<OperationResponseI[]>([]);

  constructor(
    private api: ApiService,
    private router: Router,
    private toastrSvc: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.checkSession()
  }

  checkCheckedOperation() {
    if (!localStorage.getItem('lastOperation')) {
      this.lastOperationRadioId = ""
      document.getElementById("option-2")?.setAttribute("checked", '')
    } else {
      this.lastOperationRadioId = localStorage.getItem("lastOperation")!;
      document.getElementById(this.lastOperationRadioId)?.setAttribute("checked", '')
    }

  }


  async getNewOperationsBySelectedRange() {
    const email = localStorage.getItem('email')!;
    let getRadioInputId = document.querySelector('input[name=select]:checked')?.id;

    if (this.lastOperationRadioId !== getRadioInputId) {
      this.lastOperationRadioId = getRadioInputId!

      const operationResponse = await this.getOperationsForTheLastXTimeByUserEmail(email, getRadioInputId!)
      this.userLastOperationsObs.next(operationResponse!)
      localStorage.setItem("loadedOperations", JSON.stringify(operationResponse));
      localStorage.setItem("lastOperation", getRadioInputId!)

      return operationResponse;
    }

    return null
  }

  async checkSession() {
    if (!localStorage.getItem('accessToken')) {
      this.router.navigate(['login']);
    } else {
      this.checkCheckedOperation()
      await this.checkUsersData()
      await this.checkOperationsData();
    }
  }

  async getUserByEmail(email: string) {
    try {
      const userDataResponse = await firstValueFrom(this.api.getUserByEmail(email))
      if (userDataResponse.message == "Successfully got!") {
        localStorage.setItem("loadedUser", JSON.stringify(userDataResponse));
        this.toastrSvc.success('Welcome ' + userDataResponse.firstName + "!");
        return userDataResponse;
      } else {
        throw new Error("Invalid Response");
      }
    } catch (error) {
      console.log('HTTP Error When fetching Userss data: ', error);
      const errorMessage = "Error When fetching Users's data";
      this.toastrSvc.error(errorMessage);
      return null
    }
  }

  async getOperationsForTheLastXTimeByUserEmail(email: string, operationDateRange: string) {
    let operationResponse: OperationResponseI[] | undefined;
    try {
      if (operationDateRange == "option-1") {
        console.log("fetching last 24hrs")
        operationResponse = await firstValueFrom(this.api.getOperationsForTheLast24HoursByUserEmail(email))
      } else if (operationDateRange == "option-2") {
        console.log("fetching last 7days")
        operationResponse = await firstValueFrom(this.api.getOperationsForTheLast7DaysByUserEmail(email))
      } else {
        console.log("fetching last 30days")
        operationResponse = await firstValueFrom(this.api.getOperationsForTheLast30DaysByUserEmail(email))
      }

      if (operationResponse[0] != undefined) {
        operationResponse.reverse()
        return operationResponse

      } else {
        throw new Error("Invalid Response");
      }
    } catch (error) {
      console.log('Error When fetching Users operations: ', error);
      const errorMessage = "Error When fetching User's operations";
      this.toastrSvc.error(errorMessage);
      return null
    }
  }

  async checkUsersData() {
    const email = localStorage.getItem('email');
    if (!localStorage.getItem('loadedUser')) {
      const userResponse = await this.getUserByEmail(email!);
      if (userResponse != null) {
        this.userData = userResponse
      }
    } else {
      this.userData = JSON.parse(localStorage.getItem("loadedUser")!);
    }
  }

  async checkOperationsData() {
    if (!localStorage.getItem('loadedOperations')) {
      const operationResponse = await this.getNewOperationsBySelectedRange();
      if (operationResponse != null) {
        this.userLastOperations = operationResponse
      }
    } else {
      this.userLastOperations = JSON.parse(localStorage.getItem("loadedOperations")!);
    }
    this.userLastOperationsObs.next(this.userLastOperations)
  }


}
