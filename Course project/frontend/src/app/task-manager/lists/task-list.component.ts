import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-item',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {

  tasks: Task[];
  today: number;
  userId: number;
  userRole: string;

  constructor(private taskService: TaskService) { this.userRole = (JSON.parse(localStorage.getItem('currentUser'))).role; }

  ngOnInit() {
    this.getAllTasks();
    //console.log(this.tasks);
  }

  getAllTasks() {
    this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.taskService.getTasks().subscribe(tasks => this.tasks = tasks) ;
  }

  sortTasks(sortType: string){
    this.taskService.getSortedTasks(sortType).subscribe(tasks => this.tasks = tasks);
  }

  onDelete(task_id: number){
    this.taskService.deleteTask(task_id).subscribe(tasks => this.getAllTasks());
  }
}