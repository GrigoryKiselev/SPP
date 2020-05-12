var express = require('express'),
  app = express(),
  port = 3005,
  bodyParser = require('body-parser');

const http = require('http').createServer(app);
const server = app.listen(port);
const io = require('socket.io').listen(server);
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors());

var routes = require('./app/routes/index'); 

io.on('connection', (socket) => {
  routes(socket, io);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});