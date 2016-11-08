import { ErrorService } from '../errors/error.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { User } from "./user.model";

@Injectable()
export class AuthService {
    constructor(private http: Http, private errorService: ErrorService) {}

    signup(user: User): Observable<any> {
        const body = JSON.stringify(user);
        return this.http.post('http://localhost:3000/user', body, this.getHeaders())
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    signin(user: User): Observable<any>  {
        const body = JSON.stringify(user);
        return this.http.post('http://localhost:3000/user/signin', body, this.getHeaders())
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    logout() {
        localStorage.clear();
    }

    isLoggedIn() :boolean {
        return localStorage.getItem('token') !== null;
    }

    private getHeaders(){
        const headers = new Headers({'Content-Type': 'application/json'});
        return  {headers: headers};
    }
}