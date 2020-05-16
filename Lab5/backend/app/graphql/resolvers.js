const { GraphQLScalarType } = require("graphql");
const mySqlService = require('../config/db');

const jwt = require('jsonwebtoken');
const auth = require('../config/auth');

const resolvers = {
    Query: {
      Tasks: (_, { user_id }) =>  
        {
            var tasks;
            var sortType = null;
            
            const connection = mySqlService.getDBConnection();
            switch(sortType){
                case 'name':
                case 'description':
                case 'date': sortType = sortType; break;
            }
        
            if(sortType){
                tasks = (await connection.promise().query(`SELECT * FROM tasks WHERE user_id = ? ORDER BY \`${sortType}\``, [user_id])); 
            }
            else{
                tasks = (await connection.promise().query("SELECT * FROM tasks WHERE user_id = ?", [user_id]));
            };
        
            connection.end();
            //console.log(tasks[0]);
            return tasks[0];
        },
      Task: (_, { id }) =>{
        const connection = mySqlService.getDBConnection();
        
        const sqlSelect = "SELECT * FROM tasks WHERE id = ?"; 
        let result = await connection.promise().query(sqlSelect, id);
        connection.end();
        return result[0][0];
        },
    },
    Mutation: {
      registration: (root, args) => {
        const connection = mySqlService.getDBConnection();
        const sql = `SELECT * FROM users WHERE login = '${args.login}';`;
        let result = await connection.promise().query(sql);

        if(result[0].length != 0){
            return "Such user already exist.";
        }

        const sqlInsert = `INSERT INTO users (login, password) VALUES ('${args.login}', '${args.password}'); ;`;
        await connection.promise().query(sqlInsert);
        
        const sqlSelect = `SELECT * FROM users WHERE login = '${args.login}';`;
        let newUser = await connection.promise().query(sqlSelect);    

        let user = newUser[0][0];
        user.token = generationToken(user);
        user.password = null;
        return user;
      }, 
      login: (root, args) => {
        const connection = mySqlService.getDBConnection();
   
        const sql = `SELECT * FROM users WHERE \`login\` = '${args.login}' AND password = '${args.password}' LIMIT 1;`;
        let result = await connection.promise().query(sql);

        //console.log(data);
        //console.log(result[0]);
        if(result[0].length < 1){
            return "User not found.";
        }

        let user = result[0][0];
        user.token = generationToken(user);
        user.password = null;
        res.status(200).send(user);
      }, 
    },
  };

  let generationToken = (user) => {
    return jwt.sign({
        userId: user.id
    }, auth.secretKey, { algorithm: 'HS256', expiresIn: auth.expires});
};

  module.exports.Resolvers = resolvers; 