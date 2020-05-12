'use strict';

var authService = require('../services/authService');



module.exports = function(app, io) {
  var controller = require('../controllers/taskController');
  var authController = require('../controllers/authController');

  app.on('getTasks', (jwt, sortType) => {controller.getAllTasks(jwt, sortType, io)});
  app.on('getTask', (jwt, taskId) => { controller.getTaskById(jwt, taskId, io)});
  app.on('addTask', (jwt, task) => {controller.createTask(jwt, task, io)});
  app.on('updateTask', (jwt, task) => { controller.updateTask(jwt, task, io)});
  app.on('deleteTask', (jwt, taskId) => { controller.deleteTask(jwt, taskId, io)});

  app.on('login', (req) => authController.login(req, io));
  app.on('registrate', (req) => authController.registrate(req, io));
};

