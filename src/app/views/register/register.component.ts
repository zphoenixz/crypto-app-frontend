import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { ApiService } from 'src/app/services/api/api.service';
import { UserRegisterRequestI } from 'src/app/models/userRegisterRequest.interface';
import { UserRegisterResponseI } from 'src/app/models/userRegisterResponse.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(
    private api: ApiService,
    private router: Router,
    private toastrSvc: ToastrService
  ) { }
  hide: boolean = false;
  ngOnInit(): void {
  }

  onRegister(registerForm: UserRegisterRequestI) {
    // let userRegisterForm: UserRegisterI
    if (!this.registerForm.valid) {
      return;
    }
    this.api.saveUser(registerForm).subscribe((data) => {
      let userRegisterResponseI: UserRegisterResponseI = data;
      if (userRegisterResponseI.message == "New user saved!") {


        this.router.navigate(['login']);
        this.toastrSvc.success("Register Succeed!");
      } else {
        this.toastrSvc.error("An unknown error happened");
      }
    },
      err => {
        console.log('HTTP Error', err);
        this.toastrSvc.error("An unknown error happened");
      }
    );
  }

}
