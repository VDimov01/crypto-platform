const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const {secret, sessionName} = require('../constants');

const jwtVerify = promisify(jwt.verify);

exports.auth = async(req, res, next) => {
    let token = req.cookies[sessionName];

    if(token){
        try {
            let decodedToken = await jwtVerify(token, secret);

            req.user = decodedToken;
            res.locals.user = decodedToken;
        } catch (error) {
            console.log(error);
        }

    }
    
    next();
};

//Route Guard
exports.isAuth = (req, res, next) => {
    if(!req.user){
        res.redirect('/user/login');
    }else{
        next();
    }
}

exports.isGuest = (req, res, next) => {
    if(req.user){
        res.redirect('/');	
    }else{
        next();
    }
}