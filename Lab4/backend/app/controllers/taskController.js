const mySqlService = require('../config/db');
var authService = require('../services/authService');


exports.getAllTasks = async function(jwt, sortType, io){
    let user_uniq_id = authService.getUserId(jwt);
    var tasks;
    var sortTypeChecked = null;
    
    const connection = mySqlService.getDBConnection();
    switch(sortType){
        case 'name':
        case 'description':
        case 'date': sortTypeChecked = sortType; break;
    }

    if(sortTypeChecked){
        tasks = (await connection.promise().query(`SELECT * FROM tasks WHERE user_id = ? ORDER BY \`${sortTypeChecked}\``, [user_uniq_id])); 
    }
    else{
        tasks = (await connection.promise().query("SELECT * FROM tasks WHERE user_id = ?", [user_uniq_id]));
    };

    connection.end();
    
    io.emit("getAllTasks server", tasks[0]);
}

exports.createTask = async function(jwt, task, io){
    let user_uniq_id = authService.getUserId(jwt);

    if(!task) return io.emit("addTask server", "error"); 

    const connection = mySqlService.getDBConnection();
    const sqlInsert = "INSERT INTO tasks(name, description, date, user_id) VALUES(?, ?, ?, ?)";
    let result = await connection.promise().query(sqlInsert, [task.name, task.description, task.date, user_uniq_id]);
    connection.end();

    io.emit("createTask server");
}

exports.updateTask = async function(jwt, task, io){
    let user_uniq_id = authService.getUserId(jwt);

    if(!task) return io.emit("createTask server", "error");
    
    console.log(task);

    const connection = mySqlService.getDBConnection();
        
    const sqlUpdate = "UPDATE tasks SET name = ?, description = ?, date = ? WHERE id = ? AND user_id = ?";
    await connection.promise().query(sqlUpdate, [task.name, task.description, task.date, task.id, user_uniq_id]);
    connection.end();

    io.emit("updateTask server");
}

exports.deleteTask = async function(jwt, taskId, io){
    let user_uniq_id = authService.getUserId(jwt);  

    const connection = mySqlService.getDBConnection();  
    const sqlDelete = "DELETE FROM tasks WHERE id = ? AND user_id = ?"; 
    
    await connection.promise().query(sqlDelete, [taskId, user_uniq_id]);
    connection.end();

    io.emit("deleteTask server");
}

exports.getTaskById = async function(jwt, taskId, io){
    let user_uniq_id = authService.getUserId(jwt);
    if(!taskId) return io.emit("createTask server", "error");

    const connection = mySqlService.getDBConnection();
        
    const sqlSelect = "SELECT * FROM tasks WHERE id = ? AND user_id = ?"; 
    let result = await connection.promise().query(sqlSelect, [taskId, user_uniq_id]);
    connection.end();

    io.emit("getTaskById server", result[0][0])
}