const {User} = require('../models/User');
const jwt = require('jsonwebtoken');
const { secret, sessionName} = require('../constants');


exports.register = (user) => User.create(user);

exports.login = async (email) => {
    const user = await User.findOne({email})

    return user;
};

exports.createToken = (user) => {
    //Asyncrhonous function to generate a token
    const payload = {username: user.username, _id: user._id, email: user.email};

            const promise = new Promise((resolve, reject) => {
                jwt.sign(payload, secret, {expiresIn: '1d'}, (err, decodedToken) => {
                    if(err){
                        return reject(err);
                    }

                    resolve(decodedToken);
                })
            });

            return promise;

            //Synchronous function to generate a token
            // const token = jwt.sign({username: user.username, _id: userExists._id, name: userExists.name}, secret, {expiresIn: '1h'});
            // res.cookie(sessionName, token, {httpOnly: true});
            // res.redirect('/');
}

exports.getAll = () => User.find();

exports.getOne = (id) => User.findById(id);