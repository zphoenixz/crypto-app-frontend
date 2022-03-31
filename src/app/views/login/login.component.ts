import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { ApiService } from 'src/app/services/api/api.service';
import { LoginRequestI } from 'src/app/models/loginRequest.interface';
import { LoginResponseI } from 'src/app/models/loginResponse.interface';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDataResponseI } from 'src/app/models/userDataResponse.interface';
import { Store } from '@ngrx/store';
import { decrement, increment, reset } from 'src/app/state/counter.actions';
import { CounterState } from 'src/app/state/counter.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });



  hide: boolean = false;
  constructor(
    private api: ApiService,
    private router: Router,
    private toastrSvc: ToastrService,
    private store: Store<{ counter: CounterState }>
  ) { }

  errorStatus: boolean = false;
  errorMessage: string = "";

  ngOnInit() {
    console.log("On init")
    this.checkLocalStorage();
  }

  checkLocalStorage() {
    if (localStorage.getItem('accessToken')) {
      this.router.navigate(['home']);
    }
  }

  toRegister() {
    this.router.navigate(['register']);
  }

  onLogin(form: LoginRequestI) {
    if (!this.loginForm.valid) {
      return;
    }
    this.api.login(form).subscribe((data) => {
      let loginResponseI: LoginResponseI = data;
      if (loginResponseI.message == "Login Success!") {
        localStorage.setItem("accessToken", loginResponseI.accessToken);
        localStorage.setItem("refreshToken", loginResponseI.refreshToken);
        localStorage.setItem("email", loginResponseI.email);

        this.router.navigate(['home']);
        this.toastrSvc.success("Login Succeed!");
      } else {
        this.errorStatus = true;
        this.errorMessage = "Wrong user or Password"
        this.toastrSvc.error(this.errorMessage);
      }
    },
      err => {
        console.log('HTTP Error', err);
        this.errorStatus = true;
        this.errorMessage = "Wrong user or Password"
        this.toastrSvc.error(this.errorMessage);
      }
    );
  }


  onIncrement() {
    console.log("onIncrement")
    this.store.dispatch(increment())
  }
  onDecrement() {
    console.log("onDecrement")
    this.store.dispatch(decrement())
  }
  onReset() {
    console.log("onReset")
    this.store.dispatch(reset())
  }

}
