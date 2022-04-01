import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { UserDataResponseI } from 'src/app/models/userDataResponse.interface';
import { UserInfoRequestI } from 'src/app/models/userInfoRequest.interface';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userData!: UserDataResponseI;

  patchForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    country: new FormControl(''),
    zipCode: new FormControl(''),
    address: new FormControl(''),
    dateOfBirth: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  constructor(
    private api: ApiService,
    private router: Router,
    private toastrSvc: ToastrService
  ) { }

  ngOnInit(): void {
    this.checkSession()

  }

  checkSession() {
    if (!localStorage.getItem('accessToken')) {
      this.router.navigate(['login']);
    } else {
      this.loadUserData()
    }
  }

  loadUserData() {
    this.userData = JSON.parse(localStorage.getItem("loadedUser")!)
  }

  async updateUserInfoForm(patchForm: UserInfoRequestI) {
    await this.patchUser(patchForm)
    await this.getUserByEmail(patchForm.email)
    this.router.navigate(['home']);
  }

  async patchUser(patchForm: UserInfoRequestI) {
    try {
      const userInfoResponse = await firstValueFrom(this.api.patchPersonalInfoByEmail(patchForm))
      if (userInfoResponse.message == "Personal info updated!") {
        this.toastrSvc.success('Succesfully updated');
      } else {
        throw new Error("Invalid Response");
      }
    } catch (error) {
      console.log('HTTP Error When patching Userss data: ', error);
      const errorMessage = "Error When fetching Users's data";
      this.toastrSvc.error(errorMessage);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const userDataResponse = await firstValueFrom(this.api.getUserByEmail(email))
      if (userDataResponse.message == "Successfully got!") {
        localStorage.setItem("loadedUser", JSON.stringify(userDataResponse));
        console.log(userDataResponse)
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

}
