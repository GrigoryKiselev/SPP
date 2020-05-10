import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, onErrorResumeNext } from 'rxjs';
import { Task } from '../models/task';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
});
  private socket = io(environment.SOCKET_ENDPOINT, {
    query: {
      Token: (JSON.parse(localStorage.getItem('currentUser'))).Token,
    },
  });; 

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Array<Task>> {
    this.socket.emit('getTasks', (JSON.parse(localStorage.getItem('currentUser'))).token, null);
    return new Observable<Array<Task>>(observer => {
      this.socket.on('getAllTasks server', (data: Array<Task>) =>
      {
          observer.next(data);
      });
    });
  }

  getSortedTasks(sortType: string): Observable<Array<Task>> {
    this.socket.emit('getTasks', (JSON.parse(localStorage.getItem('currentUser'))).token, sortType);
    return new Observable<Array<Task>>(observer => {
      this.socket.on('getAllTasks server', (data: Array<Task>) =>
      {
          observer.next(data);
      });
    });
  } 

  getTask(taskId: number): Observable<Task> {
    this.socket.emit('getTask', (JSON.parse(localStorage.getItem('currentUser'))).token, taskId);
    return new Observable<Task>(observer => {
      this.socket.on('getTaskById server', (data: Task) =>
      {
          observer.next(data);
      });
    });
  }

  addTask(task: Task) : Observable<Task> {
 //  var req = task;
  // req.token = JSON.parse(localStorage.getItem('currentUser')).token;
    this.socket.emit('addTask',  (JSON.parse(localStorage.getItem('currentUser'))).token, task);
    return new Observable<Task>(observer => {
      this.socket.on('createTask server', (data: Task) =>
      {
          observer.next(data);
      });
    });
  }

  updateTask(task: Task): Observable<Task>{
    this.socket.emit('updateTask', (JSON.parse(localStorage.getItem('currentUser'))).token, task);
    return new Observable<Task>(observer => {
      this.socket.on('updateTask server', (data: Task) =>
      {
          observer.next(data);
      });
    });
  }

  deleteTask(taskId: number): Observable<any> {
    this.socket.emit('deleteTask', (JSON.parse(localStorage.getItem('currentUser'))).token, taskId);
    return new Observable<Object>(observer => {
      this.socket.on('deleteTask server', (message: String) =>
      {
          observer.next(message);
      });
    });
  }

  init( task: Task) {
    let form = new HttpParams()
     .set(`id`, task.id === null ? null : task.id.toString()) 
     .set(`date`, task.date)
     .set(`description`, task.description)
     .set(`name`, task.name);

     return form;
  }
}