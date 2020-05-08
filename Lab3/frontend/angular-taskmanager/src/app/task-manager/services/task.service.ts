import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, onErrorResumeNext } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
});
  private url = environment.apiUrl;
  private singleUrl = environment.apiUrl + '/task/';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Array<Task>> {
    return this.http.get<Array<Task>>(`${this.url}tasks/`);
  }

  getSortedTasks(sortType: string): Observable<Array<Task>> {
    return this.http.get<Array<Task>>(`${this.url}tasks?sortType=${sortType}`);
  }

  getTask(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.url}tasks/${taskId}`);
  }

  addTask(task: Task) : Observable<Task> {
   console.log();
    const form = this.init(task);

    return this.http.post<Task>(`${this.url}task/`, form.toString(), {headers: this.headers});
  }

  updateTask(task: Task): Observable<Task>{
    console.log(task);
    const form = this.init(task);
    
    return this.http.put<Task>(`${this.url}task/${task.id}`, form.toString(), {headers: this.headers});
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete<any>(`${this.url}task/${taskId}`);
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