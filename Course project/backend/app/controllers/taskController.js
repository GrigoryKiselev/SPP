const mySqlService = require('../config/db');


exports.getAllTasks = async function(req, res){
    let user_uniq_id = req.headers.user_id;
    var tasks;
    var sortType = null;
    
    const connection = mySqlService.getDBConnection();
    switch(req.query.sortType){
        case 'student': sortType = 'login'; break;
        case 'mark':
        case 'subject':
        case 'details':
        case 'deadline': sortType = req.query.sortType; break;
    }

    user = (await connection.promise().query(`SELECT * FROM users WHERE id = ?`, [user_uniq_id])); 
    userRole = user[0][0].role;


    console.log(req.query.sortType);
    if (userRole == "teacher")
    {
        if(sortType){
            tasks = (await connection.promise().query(`SELECT tasks.id, tasks.subject, tasks.details, tasks.deadline, tasks.mark, tasks.user_id, u.login
            FROM tasks
            INNER JOIN users u ON u.id = tasks.user_id ORDER BY \`${sortType}\``)); 
        }
        else{
            tasks = (await connection.promise().query(`SELECT tasks.id, tasks.subject, tasks.details, tasks.deadline, tasks.mark, tasks.user_id, u.login
            FROM tasks
            INNER JOIN users u ON u.id = tasks.user_id;`)); 
            
        };
        return res.send(tasks[0]);
    }

    if(sortType){
        tasks = (await connection.promise().query(`SELECT * FROM tasks WHERE user_id = ? ORDER BY \`${sortType}\``, [user_uniq_id])); 
    }
    else{
        tasks = (await connection.promise().query("SELECT * FROM tasks WHERE user_id = ?", [user_uniq_id]));
    };

    connection.end();
    res.send(tasks[0]);
}

exports.createTask = async function(req, res){
    if(!req.body) return res.sendStatus(400);

    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);    

    const connection = mySqlService.getDBConnection();

    const sqlUser = "SELECT * FROM users WHERE login = ?";
    const user = await connection.promise().query(sqlUser, [data.student]);
    const id = user[0][0].id;

    const sqlInsert = "INSERT INTO tasks (subject, details, deadline, mark, user_id) VALUES (?, ?, ?, ?, ?);";
    let result = await connection.promise().query(sqlInsert, [data.subject, data.details, data.deadline, data.mark, id]);
    connection.end();
    

    res.status(200);
    res.send({"ok": "OK"});
}

exports.updateTask = async function(req, res){
      
    console.log("123");
    if(!req.body) return res.sendStatus(400);
        
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);  

    const connection = mySqlService.getDBConnection();
        
    const sqlUpdate = "UPDATE tasks SET subject = ?, details = ?, deadline = ?, mark = ? WHERE id = ?";
    await connection.promise().query(sqlUpdate, [data.subject, data.details, data.deadline, data.mark, req.params['id']]);
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