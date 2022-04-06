import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { LoginResponseI } from "../models/loginResponse.interface";
import { ApiService } from "../services/api/api.service";

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private apiService: ApiService,
        private toastrSvc: ToastrService,
        private router: Router,
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {

        let accessToken = localStorage.getItem('accessToken');
        if (accessToken != null) {
            req = this.setAccessToken(req, accessToken);
        }

        return next.handle(req).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse && error.status == 403) {
                return this.handele403Error(req, next)
            } else {
                this.forceLogOut()
                return throwError(error)
            }
        }));
    }

    setAccessToken(req: HttpRequest<any>, accessToken: string) {
        return req.clone({
            setHeaders: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    handele403Error(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.apiService.refreshToken().pipe(
                switchMap((refreshResponse: LoginResponseI) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(refreshResponse.accessToken);
                    this.toastrSvc.success("Tokens Refreshed!");
                    return next.handle(this.setAccessToken(req, refreshResponse.accessToken));
                }));

        } else {
            return this.refreshTokenSubject.pipe(
                filter(refreshResponse => refreshResponse != null),
                take(1),
                switchMap(accessToken => {
                    return next.handle(this.setAccessToken(req, accessToken));
                }));
        }
    }

    forceLogOut() {
        this.toastrSvc.error("Expired Session!");
        localStorage.clear();
        this.router.navigate(['login']);
    }
}