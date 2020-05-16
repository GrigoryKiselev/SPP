const jwt = require('jsonwebtoken');
const auth = require('../config/auth');
const mySqlService = require('../config/db');


exports.login = async function(req, res){
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);

    const connection = mySqlService.getDBConnection();
   
    const sql = `SELECT * FROM users WHERE \`login\` = '${data.login}' AND password = '${data.password}' LIMIT 1;`;
    let result = await connection.promise().query(sql);


    //console.log(data);
    //console.log(result[0]);
    if(result[0].length < 1){
        res.status(404).send({
            message: 'User not found.'
        });
        return;
    }

    let user = result[0][0];
    user.token = generationToken(user);
    user.password = null;
    res.status(200).send(user);
};

exports.registrate = async function(req, res){
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);

    const connection = mySqlService.getDBConnection();
    const sql = `SELECT * FROM users WHERE login = '${data.login}';`;
    let result = await connection.promise().query(sql);

    if(result[0].length != 0){
        res.status(400).send({
            message: 'Such user already exist.'
        });
        return;
    }

    const sqlInsert = `INSERT INTO users (login, password, role) VALUES ('${data.login}', '${data.password}', '${data.role}'); ;`;
    await connection.promise().query(sqlInsert);
    
    const sqlSelect = `SELECT * FROM users WHERE login = '${data.login}';`;
    let newUser = await connection.promise().query(sqlSelect);    

    let user = newUser[0][0];
    user.token = generationToken(user);
    user.password = null;
    res.status(200).send(user);
}

let generationToken = (user) => {
    return jwt.sign({
        userId: user.id
    }, auth.secretKey, { algorithm: 'HS256', expiresIn: auth.expires});
};