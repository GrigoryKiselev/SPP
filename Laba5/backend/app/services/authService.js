const jwt = require("jsonwebtoken");
const atob = require('atob');
const PRIVATE_KEY = require('../config/auth').secretKey;

exports.authenticate = function(req, res) {
    try {
        console.log(req.headers);
        var token = req.headers.authorization.replace('Bearer ', '');
        return jwt.verify(token, PRIVATE_KEY);
    } catch (e) {
        console.log(e);
        res.sendStatus(401);
        return false;
    }
};

exports.getUserId = function(req, res) {
    var token = req.headers.authorization.replace('Bearer ', '');
    console.log(token, JSON.parse(atob(token.split('.')[1])));
    req.headers.user_id = JSON.parse(atob(token.split('.')[1])).userId;
};

