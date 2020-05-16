import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent} from './task-manager/lists/task-list.component';
import { TaskFormComponent} from './task-manager/forms/task-form.component';
import { LoginComponent } from './login-manager/forms/login-form.component';
import { AuthGuard } from './login-manager/services/auth.guard';
import { RegComponent } from './login-manager/forms/reg-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard]},
  { path: 'task', component: TaskFormComponent },
  { path: 'task/:id', component: TaskFormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }