const express = require("express");
const app = express();
const mysql = require("mysql2");
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

function getDBConnection(){
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "task_manager",
    password: process.env.SQL_PASSWORD
  });
}

async function getTasks(){
  const connection = getDBConnection();
  
  const sql = `SELECT * FROM tasks`;
   
  var tasks = (await connection.promise().query(sql))[0];
  connection.end();
  return tasks;
};
 
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

app.post('/insertTask', urlencodedParser, async function(req, res) {
    if (!req.body) return console.log("500");
    console.log(req.body);

    const connection = getDBConnection();

    const sqlInsert = `INSERT INTO tasks(name, description, datetime) VALUES('${req.body.form_taskName}', '${req.body.form_taskDescription}', '${req.body.form_taskDateTime}')`;

    await connection.promise().query(sqlInsert)[0];
    connection.end();

    return res.redirect('/');
});

app.post('/deleteTask', urlencodedParser, async function(req, res) {
    if (!req.body) return console.log("500");
    console.log(req.body);

    const connection = getDBConnection();

    var tName = req.body.form_taskName;
    
    const sqlDelete = `DELETE FROM tasks WHERE name='${tName}'`;

    await connection.promise().query(sqlDelete)[0];
    connection.end();

    return res.redirect('/');
});

app.post('/updateTask', urlencodedParser, async function(req, res) {
    if (!req.body) return console.log("500");
    console.log(req.body);

    const connection = getDBConnection();

    var tName = req.body.form_taskName;

    const sqlUpdate = `UPDATE tasks SET description='${req.body.form_taskDescription}', datetime='${req.body.form_taskDateTime}' WHERE name='${req.body.form_taskName}'`;

    await connection.promise().query(sqlUpdate)[0];

    connection.end();
    return res.redirect('/');
});

app.post('/sortTasks', urlencodedParser, async function(req, res) {
    if (!req.body) return console.log("500");
    console.log(req.body);

    const connection = getDBConnection();

    var checkOption = '';
    if (req.body.optionName == 'checkName') {
        checkOption = 'name';
        console.log(checkOption);
    }
       
    if (req.body.optionDateTime == 'checkDateTime')
       checkOption = 'datetime'

    if (checkOption == '')
      console.log('option was not selected');

    const sqlUp = `SELECT *, Rank() over(order by ${checkOption}) number FROM tasks ORDER BY ${checkOption};`;

    //console.log("---------------------------------------------------------------------------")
    var tasks = (await connection.promise().query(sqlUp))[0];

    res.render("tasks", {
      title: "Мои задачи",
      tasksVisible: true,
      tasks
    });
    connection.end();
});
 
app.get("/", async function(request, response){
    var tasks = await getTasks();

    console.log(tasks);
    response.render("tasks", {
        title: "Мои задачи",
        tasksVisible: true,
        tasks
    });
});

app.listen(3001, function() {
    console.log("Server was started");
});