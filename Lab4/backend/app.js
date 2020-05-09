var express = require('express'),
  app = express(),
  port = 3005,
  bodyParser = require('body-parser');
  
  const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors());

var routes = require('./app/routes/index'); 
routes(app); 

app.listen(port, () => {
  console.log('Server starts on ' + port);
});