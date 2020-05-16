const mySqlService = require('../config/db');


exports.getAllTasks = async function(req, res){
    let user_uniq_id = req.headers.user_id;
    var tasks;
    var sortType = null;
    
    const connection = mySqlService.getDBConnection();
    switch(req.query.sortType){
        case 'name':
        case 'description':
        case 'date': sortType = req.query.sortType; break;
    }

    if(sortType){
        tasks = (await connection.promise().query(`SELECT * FROM tasks WHERE user_id = ? ORDER BY \`${sortType}\``, [user_uniq_id])); 
        //console.log(req.query.sortType);
    }
    else{
        tasks = (await connection.promise().query("SELECT * FROM tasks WHERE user_id = ?", [user_uniq_id]));
    };

    connection.end();
    
    console.log(tasks[0]);
    res.send(tasks[0]);
}

exports.createTask = async function(req, res){
    let user_uniq_id = req.headers.user_id;

    if(!req.body) return res.sendStatus(400);

    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);     

    const connection = mySqlService.getDBConnection();
    const sqlInsert = "INSERT INTO tasks(name, description, date, user_id) VALUES(?, ?, ?, ?)";
    let result = await connection.promise().query(sqlInsert, [data.name, data.description, data.date, user_uniq_id]);
    connection.end();

    console.log(result);
    res.status(200);
    res.send({"ok": "OK"});
}

exports.updateTask = async function(req, res){
      
    if(!req.body) return res.sendStatus(400);
        
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);  

    const connection = mySqlService.getDBConnection();
        
    const sqlUpdate = "UPDATE tasks SET name = ?, description = ?, date = ? WHERE id = ?";
    await connection.promise().query(sqlUpdate, [data.name, data.description, data.date, req.params['id']]);
    connection.end();

    res.status(200);
    res.send({"ok": "OK"});
}

exports.deleteTask = async function(req, res){
      
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);  

    const connection = mySqlService.getDBConnection();  
    const sqlDelete = "DELETE FROM tasks WHERE id = ?"; 
    
    await connection.promise().query(sqlDelete, [req.params['id']]);
    connection.end();

    res.status(200);
    res.send({"ok": "OK"});
}

exports.getTaskById = async function(req, res){

    if(!req.body) return res.sendStatus(400);

    const connection = mySqlService.getDBConnection();
        
    const sqlSelect = "SELECT * FROM tasks WHERE id = ?"; 
    let result = await connection.promise().query(sqlSelect, [req.params['id']]);
    connection.end();

    res.send(result[0][0]);
}