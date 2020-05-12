import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';

import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private socket = io(environment.SOCKET_ENDPOINT);
    private headers: HttpHeaders = new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
    });

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user: User): Observable<User> {

        this.socket.emit('login', user);
        return new Observable<User>(observer => {
            this.socket.on('login server', (user: User) =>
            {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                observer.next(user);
            });
        });
    }

    registrate(user: User) {
        this.socket.emit('registrate', JSON.stringify(user));
        return new Observable<User>(observer => {
            this.socket.on('registrate server', (user: User) =>
            {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                observer.next(user);
            });
        });
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    /*init(user: User) {
        let form = new HttpParams()
         .set(`id`, user.id !== null ? user.id.toString() : null)
         .set(`login`, user.login)
         .set(`password`, user.password)
         .set(`token`, user.token)
    
         return form;
      }*/
}