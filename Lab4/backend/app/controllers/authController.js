const jwt = require('jsonwebtoken');
const auth = require('../config/auth');
const mySqlService = require('../config/db');


exports.login = async function(req, io){

    const connection = mySqlService.getDBConnection();
   
    let result = await connection.promise().query(`SELECT * FROM users WHERE \`login\` = ? AND password = ? LIMIT 1;`, [req.login, req.password]);

    if(result[0].length < 1){
        io.emit("login server", 'User not found.');
        return;
    }

    let user = result[0][0];
    user.token = generationToken(user);
    user.password = null;
    io.emit("login server", user);
};

exports.registrate = async function(req, io){ 
    let json = JSON.stringify(req);
    let data = JSON.parse(json);

    const connection = mySqlService.getDBConnection();
    const sql = `SELECT * FROM users WHERE login = '${data.login}';`;
    let result = await connection.promise().query(sql);

    if(result[0].length != 0){
        io.emit("registrate server", 'Such user already exist.');
        return;
    }

    const sqlInsert = `INSERT INTO users (login, password) VALUES ('${data.login}', '${data.password}'); ;`;
    await connection.promise().query(sqlInsert);
    
    const sqlSelect = `SELECT * FROM users WHERE login = '${data.login}';`;
    let newUser = await connection.promise().query(sqlSelect);    

    let user = newUser[0][0];
    user.token = generationToken(user);
    user.password = null;
    io.emit("registrate server", user);
}

let generationToken = (user) => {
    return jwt.sign({
        userId: user.id
    }, auth.secretKey, { algorithm: 'HS256', expiresIn: auth.expires});
};