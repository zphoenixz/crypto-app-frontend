import { Injectable } from '@angular/core';
import { LoginRequestI } from 'src/app/models/loginRequest.interface';
import { LoginResponseI } from 'src/app/models/loginResponse.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDataResponseI } from 'src/app/models/userDataResponse.interface';
import { UserRegisterRequestI } from 'src/app/models/userRegisterRequest.interface';
import { UserRegisterResponseI } from 'src/app/models/userRegisterResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = "https://ec2-13-57-255-162.us-west-1.compute.amazonaws.com:8084";

  constructor(private http: HttpClient) { }

  login(form: LoginRequestI): Observable<LoginResponseI> {
    let loginEndPoint = `${this.url}/user-auth-service/user/auth/login`;

    return this.http.post<LoginResponseI>(loginEndPoint, form);
  }

  getUserByEmail(email: string): Observable<UserDataResponseI> {
    let getUserByEmailEndPoint = `${this.url}/user-registration-service/user/registration/getUserByEmail?email=${email}`;
    return this.http.get<UserDataResponseI>(getUserByEmailEndPoint);
  }

  saveUser(form: UserRegisterRequestI): Observable<UserRegisterResponseI> {
    let loginEndPoint = `${this.url}/user-registration-service/user/registration/saveUser`;

    return this.http.post<UserRegisterResponseI>(loginEndPoint, form);
  }
}
