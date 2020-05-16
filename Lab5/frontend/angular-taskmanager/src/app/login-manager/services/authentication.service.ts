import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { User } from '../models/user';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private url = environment.apiUrl+ "login/";
    private reg = environment.apiUrl+ "registrate/";
    private headers: HttpHeaders = new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
    });

    constructor(private http: HttpClient, private apollo: Apollo) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user: User) {
        return new Observable<User>(observer => {
            const login = gql`
            mutation login($login: String!
                            $password: String!) {
            login(
                login: $login
                password: $password
                ) {
                    _id
                    login
                    password
                    token
                }
            }
        `;
        this.apollo
            .mutate({
            mutation: login,
            variables: {
                userName: user.login,
                password: user.password,
            }
            })
            .subscribe((user:any) => {
                const data = user.data.login;
                localStorage.setItem('currentUser', JSON.stringify(data));
                this.currentUserSubject.next(data);
                observer.next(data);
            },
            error => {
                console.log("there was an error sending the query", error);
            });
        });
    }

    registrate(user: User) {
        return new Observable<User>(observer => {
            const registration = gql`
            mutation registration($login: String!
                        $password: String!) {
            registration(
                login: $login
                password: $password
            ) {
                    _id
                    login
                    password
                    token
                }
            }
        `;
        this.apollo
            .mutate({
            mutation: registration,
            variables: {
                login: user.login,
                password: user.password,
            }
            })
            .subscribe((user:any) => {
                const data = user.data.login;
                localStorage.setItem('currentUser', JSON.stringify(data));
                this.currentUserSubject.next(data);
                observer.next(data);
            },
            error => {
                console.log("there was an error sending the query", error);
            });
        });
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    init(user: User) {
        let form = new HttpParams()
         .set(`id`, user.id !== null ? user.id.toString() : null)
         .set(`login`, user.login)
         .set(`password`, user.password)
         .set(`token`, user.token)
    
         return form;
      }
}