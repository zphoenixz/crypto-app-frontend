import { Injectable } from '@angular/core';
import { LoginI } from 'src/app/models/login.interface';
import { LoginResponseI } from 'src/app/models/loginResponse.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = "http://ec2-13-57-255-162.us-west-1.compute.amazonaws.com:8084";

  constructor(private http: HttpClient) { }

  login(form: LoginI): Observable<LoginResponseI> {
    let loginEndPoint = `${this.url}/user-auth-service/user/auth/login`;

    return this.http.post<LoginResponseI>(loginEndPoint, form);
  }
}
