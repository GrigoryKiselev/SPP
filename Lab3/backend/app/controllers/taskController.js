const mySqlService = require('../config/db');


exports.getAllTasks = async function(req, res){
    let user_uniq_id = req.headers.user_id;
    
    const connection = mySqlService.getDBConnection();
    console.log(req.headers);
    const sql = `SELECT * FROM tasks WHERE user_id = ${user_uniq_id}`;
   
    var tasks = (await connection.promise().query(sql))[0];
    connection.end();
    
    res.send(tasks);
}

exports.createTask = async function(req, res){
    let user_uniq_id = req.headers.user_id;

    if(!req.body) return res.sendStatus(400);

    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);     

    const connection = mySqlService.getDBConnection();
    const sqlInsert = `INSERT INTO tasks(name, description, date, user_id) VALUES('${data.name}', '${data.description}', '${data.date}', ${user_uniq_id})`;
    await connection.promise().query(sqlInsert);
    connection.end();

    res.status(200);
    res.send({"ok": "OK"});
}

exports.updateTask = async function(req, res){
      
    if(!req.body) return res.sendStatus(400);
        
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);  

    const connection = mySqlService.getDBConnection();
        
    const sqlUpdate = `UPDATE tasks SET name = '${data.name}', description = '${data.description}', date = '${data.date}' WHERE id = '${req.params['id']}'`;
    await connection.promise().query(sqlUpdate);
    connection.end();

    res.status(200);
    res.send({"ok": "OK"});
}

exports.deleteTask = async function(req, res){
      
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);  

    const connection = mySqlService.getDBConnection();  
    const sqlDelete = `DELETE FROM tasks WHERE id='${req.params['id']}'`; 
    
    await connection.promise().query(sqlDelete);
    connection.end();

    res.status(200);
    res.send({"ok": "OK"});
}

exports.sortTasks = async function(req, res){
    let user_uniq_id = req.headers.user_id;
    if(!req.body) return res.sendStatus(400);
        
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);  

    const connection = mySqlService.getDBConnection();
        
    const sqlSort = `SELECT * FROM tasks WHERE user_id = '${user_uniq_id}' ORDER BY \`${req.query.sortType}\``; 
    let result = await connection.promise().query(sqlSort);
    connection.end();

    res.send(result[0]); 
}

exports.getTaskById = async function(req, res){

    if(!req.body) return res.sendStatus(400);
        
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);  

    const connection = mySqlService.getDBConnection();
        
    const sqlSelect = `SELECT * FROM tasks WHERE id='${req.params['id']}'`; 
    let result = await connection.promise().query(sqlSelect);
    connection.end();

    res.send(result[0][0]);
}