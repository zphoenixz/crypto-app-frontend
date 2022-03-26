import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { ApiService } from 'src/app/services/api/api.service';
import { LoginI } from 'src/app/models/login.interface';
import { LoginResponseI } from 'src/app/models/loginResponse.interface';

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
  constructor(private api: ApiService) {
  }

  ngOnInit() {
  }

  onLogin(form: LoginI) {
    if (!this.loginForm.valid) {
      return;
    }
    console.log(form);
    this.api.login(form).subscribe((data: LoginResponseI) => {
      console.log('1..........');
      console.log(data);
      console.log('2..........');
    },
      err => console.log('HTTP Error', err),
    );

  }

}
