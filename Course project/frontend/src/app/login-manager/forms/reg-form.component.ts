import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import {User} from '../models/user';
import { regUser } from '../models/regUser';


@Component({
    selector: 'app-reg-form', 
    templateUrl: 'reg-form.component.html'

 })

export class RegComponent implements OnInit {
    user = new regUser("", "", "");
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
            this.router.navigate(['/login']);
        }
    }

   ngOnInit() {
    }

    onRegistrate(user: regUser) {
        this.submitted = true;
    
        this.loading = true;
        this.authenticationService.registrate(new User(null, user.login, user.password, "student", null))
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