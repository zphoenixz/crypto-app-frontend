import { Injectable } from '@angular/core';
import { LoginRequestI } from 'src/app/models/loginRequest.interface';
import { LoginResponseI } from 'src/app/models/loginResponse.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
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
  apiUrl: string = "http://ec2-13-57-255-162.us-west-1.compute.amazonaws.com:8084";

  constructor(private http: HttpClient) { }

  login(form: LoginRequestI): Observable<LoginResponseI> {
    let loginEndPoint = `${this.apiUrl}/user-auth-service/user/auth/login`;

    return this.http.post<LoginResponseI>(loginEndPoint, form);
  }

  getUserByEmail(email: string): Observable<UserDataResponseI> {
    let getUserByEmailEndPoint = `${this.apiUrl}/user-registration-service/user/registration/getUserByEmail?email=${email}`;
    return this.http.get<UserDataResponseI>(getUserByEmailEndPoint).pipe(
      map(response => response)
    );
  }

  saveUser(form: UserRegisterRequestI): Observable<UserRegisterResponseI> {
    let loginEndPoint = `${this.apiUrl}/user-registration-service/user/registration/saveUser`;

    return this.http.post<UserRegisterResponseI>(loginEndPoint, form);
  }

  getOperationsForTheLast7DaysByUserEmail(email: string): Observable<OperationResponseI[]> {
    let getLast7DaysOperations = `${this.apiUrl}/user-operation-service/user/operation/getOperationsForTheLast7DaysByUserEmail?email=${email}`;
    return this.http.get<OperationResponseI[]>(getLast7DaysOperations).pipe(
      map(response => response)
    );
  }

  getOperationsForTheLast24HoursByUserEmail(email: string): Observable<OperationResponseI[]> {
    let getLast24HrsOperations = `${this.apiUrl}/user-operation-service/user/operation/getOperationsForTheLast24HoursByUserEmail?email=${email}`;
    return this.http.get<OperationResponseI[]>(getLast24HrsOperations).pipe(
      map(response => response)
    );
  }

  getOperationsForTheLast30DaysByUserEmail(email: string): Observable<OperationResponseI[]> {
    let getLast30DaysOperations = `${this.apiUrl}/user-operation-service/user/operation/getOperationsForTheLast30DaysByUserEmail?email=${email}`;
    return this.http.get<OperationResponseI[]>(getLast30DaysOperations).pipe(
      map(response => response)
    );
  }

  patchPersonalInfoByEmail(form: UserInfoRequestI): Observable<UserInfoResponseI> {
    let loginEndPoint = `${this.apiUrl}/user-registration-service/user/registration/updatePersonalInfoByEmail`;

    return this.http.patch<UserInfoResponseI>(loginEndPoint, form);
  }

  refreshToken() {
    return this.http.post<any>(`${this.apiUrl}/user-auth-service/user/auth/refreshToken`, {
      'refreshToken': localStorage.getItem('refreshToken')
    }).pipe(tap((refreshResponse: LoginResponseI) => {
      this.storeJwtToken(refreshResponse);
    }));
  }

  private storeJwtToken(refreshResponse: LoginResponseI) {
    localStorage.setItem("accessToken", refreshResponse.accessToken);
    localStorage.setItem("refreshToken", refreshResponse.refreshToken);
  }
}
