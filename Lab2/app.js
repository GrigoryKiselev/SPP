var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
 
var app = express();
var jsonParser = bodyParser.json();
 
app.use(express.static(__dirname + "/public"));

app.get("/api/tasks", function(req, res){
      
    var content = fs.readFileSync("tasks.json", "utf8");
    var tasks = JSON.parse(content);
    res.send(tasks);
});

app.get("/api/tasks/:id", function(req, res){
      
    var id = req.params.id; 
    var content = fs.readFileSync("tasks.json", "utf8");
    var tasks = JSON.parse(content);
    var task = null;
    
    for(var i=0; i<tasks.length; i++){
        if(tasks[i].id==id){
            task = tasks[i];
            break;
        }
    }
    
    if(task){
        res.send(task);
    }
    else{
        res.status(404).send();
    }
});

app.post("/api/tasks", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    var taskName = req.body.name;
    var taskDescription = req.body.description;
    var task = {name: taskName, description: taskDescription};
     
    var data = fs.readFileSync("tasks.json", "utf8");
    var tasks = JSON.parse(data);
     

    var id = Math.max.apply(Math,tasks.map(function(o){return o.id;}))

    task.id = id+1;

    tasks.push(task);
    var data = JSON.stringify(tasks);

    fs.writeFileSync("tasks.json", data);
    res.send(task);
});

app.delete("/api/tasks/:id", function(req, res){
      
    var id = req.params.id;
    var data = fs.readFileSync("tasks.json", "utf8");
    var tasks = JSON.parse(data);
    var index = -1;

    for(var i=0; i<tasks.length; i++){
        if(tasks[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){

        var task = tasks.splice(index, 1)[0];
        var data = JSON.stringify(tasks);
        fs.writeFileSync("tasks.json", data);

        res.send(task);
    }
    else{
        res.status(404).send();
    }
});

app.put("/api/tasks", jsonParser, function(req, res){
      
    if(!req.body) return res.sendStatus(400);
     
    var taskId = req.body.id;
    var taskName = req.body.name;
    var taskDescription = req.body.description;
     
    var data = fs.readFileSync("tasks.json", "utf8");
    var tasks = JSON.parse(data);
    var task;
    for(var i=0; i<tasks.length; i++){
        if(tasks[i].id==taskId){
            task = tasks[i];
            break;
        }
    }

    if(task){
        task.description = taskDescription;
        task.name = taskName;
        var data = JSON.stringify(tasks);
        fs.writeFileSync("tasks.json", data);
        res.send(task);
    }
    else{
        res.status(404).send(task);
    }
});
  
app.listen(3000, function(){
    console.log("Server was started");
});