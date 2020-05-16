import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import {User} from '../models/user';


@Component({
    selector: 'app-login-form', 
    templateUrl: 'login-form.component.html'

 })

export class LoginComponent implements OnInit {
    user = new User(null, "", "", "", null);
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        if (this.authenticationService.currentUserValue) { 
            let userId = this.authenticationService.currentUserValue.id;
            this.router.navigate([`tasks`]);
        }
    }

   ngOnInit() {
    }

  onSubmit(user: User) {
    this.submitted = true;

    this.loading = true;
    this.authenticationService.login(user)
        .pipe(first())
        .subscribe(
            data => {
                let userId = data.id;
                this.router.navigate([`tasks`]);
            },
            error => {
                this.error = error;
                console.log(error);
                this.loading = false;
            });
    }

    onRegistrate(user: User) {
        this.submitted = true;
    
        this.loading = true;
        this.authenticationService.registrate(user)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/login']);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
        }
}