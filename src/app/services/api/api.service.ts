import { Injectable } from '@angular/core';
import { LoginRequestI } from 'src/app/models/loginRequest.interface';
import { LoginResponseI } from 'src/app/models/loginResponse.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserDataResponseI } from 'src/app/models/userDataResponse.interface';
import { UserRegisterRequestI } from 'src/app/models/userRegisterRequest.interface';
import { UserRegisterResponseI } from 'src/app/models/userRegisterResponse.interface';
import { OperationResponseI } from 'src/app/models/operationResponse.interface';
import { UserInfoResponseI } from 'src/app/models/userInfoResponse.interface';
import { UserInfoRequestI } from 'src/app/models/userInfoRequest.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = "http://ec2-13-57-255-162.us-west-1.compute.amazonaws.com:8084";

  constructor(private http: HttpClient) { }

  login(form: LoginRequestI): Observable<LoginResponseI> {
    let loginEndPoint = `${this.url}/user-auth-service/user/auth/login`;

    return this.http.post<LoginResponseI>(loginEndPoint, form);
  }

  getUserByEmail(email: string): Observable<UserDataResponseI> {
    let getUserByEmailEndPoint = `${this.url}/user-registration-service/user/registration/getUserByEmail?email=${email}`;
    return this.http.get<UserDataResponseI>(getUserByEmailEndPoint).pipe(
      map(response => response)
    );
  }

  saveUser(form: UserRegisterRequestI): Observable<UserRegisterResponseI> {
    let loginEndPoint = `${this.url}/user-registration-service/user/registration/saveUser`;

    return this.http.post<UserRegisterResponseI>(loginEndPoint, form);
  }

  getOperationsForTheLast7DaysByUserEmail(email: string): Observable<OperationResponseI[]> {
    let getLast7DaysOperations = `${this.url}/user-operation-service/user/operation/getOperationsForTheLast7DaysByUserEmail?email=${email}`;
    return this.http.get<OperationResponseI[]>(getLast7DaysOperations).pipe(
      map(response => response)
    );
  }

  getOperationsForTheLast24HoursByUserEmail(email: string): Observable<OperationResponseI[]> {
    let getLast24HrsOperations = `${this.url}/user-operation-service/user/operation/getOperationsForTheLast24HoursByUserEmail?email=${email}`;
    return this.http.get<OperationResponseI[]>(getLast24HrsOperations).pipe(
      map(response => response)
    );
  }

  getOperationsForTheLast30DaysByUserEmail(email: string): Observable<OperationResponseI[]> {
    let getLast30DaysOperations = `${this.url}/user-operation-service/user/operation/getOperationsForTheLast30DaysByUserEmail?email=${email}`;
    return this.http.get<OperationResponseI[]>(getLast30DaysOperations).pipe(
      map(response => response)
    );
  }

  patchPersonalInfoByEmail(form: UserInfoRequestI): Observable<UserInfoResponseI> {
    let loginEndPoint = `${this.url}/user-registration-service/user/registration/updatePersonalInfoByEmail`;

    return this.http.patch<UserInfoResponseI>(loginEndPoint, form);
  }
}
