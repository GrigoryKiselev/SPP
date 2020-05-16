import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, onErrorResumeNext } from 'rxjs';
import { Task } from '../models/task';
import { Apollo } from "apollo-angular";
import { map } from 'rxjs/operators';
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
});
  private url = environment.apiUrl;
  private singleUrl = environment.apiUrl + '/task/';

  constructor(private http: HttpClient, private apollo: Apollo) { }

  getTasks(): Observable<Array<Task>> {
    return new Observable<Array<Task>>(observer => {
      const getTasks = gql`
          query GetTasks($user_id: ID!) {
            Tasks (user_id: $user_id){
              id
              name
              date
              description
              user_id
            }
          }
      `;
  
      this.apollo
        .watchQuery({
          query: getTasks,
          variables: {
        },
          fetchPolicy: "network-only"
        })
        .valueChanges
        .subscribe((data:any) => {
          observer.next(data.data.Tasks);
        });
      });
  }

  getTask(taskId: number): Observable<Task> {
    return new Observable<Task>(observer => {
      const getTask = gql`
          query GetTask($id: ID!) {
            Task (id: $id){
              id
              name
              date
              description
              user_id
            }
          }
      `;

      this.apollo
        .watchQuery({
          query: getTask,
          variables: {
            id: taskId,
        },
          fetchPolicy: "network-only"
        })
        .valueChanges
        .subscribe((data:any) => {
          observer.next(data.data.Task);
        });
      });
  }

  addTask(task: Task) : Observable<Task> {
    return new Observable<Task>(observer => {
      const addTask = gql`
      mutation addTask(
        $name: String!
        $date: String!
        $description: String!
        $user_id: ID!
        ) {
          addTask(
          name: $name
          date: $date
          description: $desription
          user_id: $user_id
          ) {
            id
            name
            date
            description
            user_id
          }
      }
  `;
  this.apollo
      .mutate({
      mutation: addTask,
      variables: {
        name: task.name,
        date: task.date,
        description: task.description,
        user_id: task.user_id,
      },
      fetchPolicy: "no-cache"
      })
      .subscribe((data:any) => {
          observer.next(data.data.addTask);
      },
      error => {
          console.log("there was an error sending the query", error);
      });
  });
  }

  updateTask(task: Task): Observable<Task>{
    return new Observable<Task>(observer => {
      const updateTask = gql`
      mutation updateTask(
        $name: String!
        $date: String!
        $description: String!
        $user_id: ID!
        ) {
        updateTask(
          name: $name
          date: $date
          description: $desription
          user_id: $user_id
          ) {
            id
            name
            date
            description
            user_id
          }
      }
  `;
  this.apollo
      .mutate({
      mutation: updateTask,
      variables: {
        id: task.id,
        name: task.name,
        deadline: task.date,
        details: task.description,
        user_id: task.user_id,
      },
      fetchPolicy: "no-cache"
      })
      .subscribe((data:any) => {
          observer.next(data.data.updateTask);
      },
      error => {
          console.log("there was an error sending the query", error);
      });
  });
  }

  deleteTask(taskId: Object): Observable<Object> {
    return new Observable<Object>(observer => {
      const deleteTask = gql`
      mutation deleteTask(
        $id: ID!) {
          deleteTask(
        id: $id
          ) {
            id
          }
      }
  `;
  this.apollo
      .mutate({
      mutation: deleteTask,
      variables: {
          id: taskId
      },
      })
      .subscribe((data:any) => {
          observer.next(data.data.deleteTask);
      },
      error => {
          console.log("there was an error sending the query", error);
      });
  });
  }

  init( task: Task) {
    let form = new HttpParams()
     .set(`id`, task.id === null ? null : task.id.toString()) 
     .set(`date`, task.date)
     .set(`description`, task.description)
     .set(`name`, task.name)
     .set(`user_id`, task.user_id.toString())

     return form;
  }
}