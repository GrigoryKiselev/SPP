'use strict';

var authService = require('../services/authService');

var authMiddleware = function(req, res, next) {
  if (authService.authenticate(req, res)) {
      authService.getUserId(req, res);
      console.log(req.headers.user_id);
      next();
  }
};

module.exports = function(app) {
  var controller = require('../controllers/taskController');
  var authController = require('../controllers/authController');
  
  console.log("index");
  
  app.route('/tasks').get(authMiddleware, controller.getAllTasks);
  app.route('/tasks/:id').get(authMiddleware, controller.getTaskById);
  app.route('/task').post(authMiddleware, controller.createTask);
  app.route('/task/:id').put(authMiddleware,controller.updateTask);
  app.route('/task/:id').delete(authMiddleware, controller.deleteTask);
  app.route('/login').post(authController.login);
  app.route('/registrate').post(authController.registrate);
};

