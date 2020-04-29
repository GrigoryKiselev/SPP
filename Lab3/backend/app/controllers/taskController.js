const mySqlService = require('../config/db');


exports.getAllTasks = async function(req, res){
    //let user_uniq_id = req.params.userId;
    //console.log(req);
    
    const connection = mySqlService.getDBConnection();
  
    const sql = `SELECT * FROM tasks`;// WHERE user_id = 1`; //////////////// to do
   
    var tasks = (await connection.promise().query(sql))[0];
    connection.end();
    
    res.send(tasks);
}

exports.createTask = async function(req, res){

    if(!req.body) return res.sendStatus(400);

    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);     

    const connection = mySqlService.getDBConnection();

    const sqlInsert = `INSERT INTO tasks(name, description, date, user_id) VALUES('${data.name}', '${data.description}', '${data.date}', '${data.user_id}')`;
    await connection.promise().query(sqlInsert);
    connection.end();

    res.sendStatus(200);
}

exports.updateTask = async function(req, res){
      
    if(!req.body) return res.sendStatus(400);
        
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);  

    const connection = mySqlService.getDBConnection();
        
    const sqlUpdate = `UPDATE tasks SET name = '${data.name}', description = '${data.description}', date = '${data.date}' WHERE id = '${data.id}'`; ///////////// to do
    await connection.promise().query(sqlUpdate);
    connection.end();

    res.sendStatus(200);
}

exports.deleteTask = async function(req, res){
      
    if(!req.body) return res.sendStatus(400);
        
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);  

    const connection = mySqlService.getDBConnection();
        
    const sqlDelete = `DELETE FROM tasks WHERE id='${data.id}'`; ///////////// to do
    await connection.promise().query(sqlDelete);
    connection.end();

    res.sendStatus(200);
}

exports.sortTasks = async function(req, res){
      
    console.log(req.query.sortType);
    if(!req.body) return res.sendStatus(400);
        
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);  

    const connection = mySqlService.getDBConnection();
        
    const sqlSort = `SELECT * FROM tasks ORDER BY \`${req.query.sortType}\``; 
    let result = await connection.promise().query(sqlSort);
    connection.end();

    res.send(result[0]); 
}