import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskService } from './task-manager/services/task.service';
import { TaskListComponent } from './task-manager/lists/task-list.component';
import { TaskFormComponent } from './task-manager/forms/task-form.component';
import { LoginComponent } from './login-manager/forms/login-form.component';
import { AuthenticationService } from './login-manager/services/authentication.service';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { RegComponent } from './login-manager/forms/reg-form.component';
import { SocketioService } from './helpers/socketio.service';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskFormComponent,
    LoginComponent,
    RegComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    HttpClient,
    TaskService,
    AuthenticationService,
    SocketioService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }