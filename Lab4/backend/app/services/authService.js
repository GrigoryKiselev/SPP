const jwt = require("jsonwebtoken");
const atob = require('atob');
const PRIVATE_KEY = require('../config/auth').secretKey;

exports.authenticate = function(req, io) {
    try {
        console.log(req.headers);
        var token = req.headers.authorization.replace('Bearer ', '');
        return jwt.verify(token, PRIVATE_KEY);
    } catch (e) {
        console.log(e);
        io.emit("authenticate server");
        return false;
    }
};

exports.getUserId = function(jwt) {
    var token = jwt.replace('Bearer ', '');
    return JSON.parse(atob(token.split('.')[1])).userId;
};

