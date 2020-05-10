import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './login-manager/services/authentication.service';
import { User } from './login-manager/models/user';
import { Router } from '@angular/router';
import { SocketioService } from './helpers/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  currentUser: User;

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService,
      private socketService: SocketioService
  ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.socketService.setupSocketConnection();
  }

  logout() {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
  }
}