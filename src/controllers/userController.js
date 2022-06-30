const router = require('express').Router();
const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secret, sessionName} = require('../constants');
const {body, validationResult} = require('express-validator');
const {isAuth, isGuest} = require('../middlewares/authMiddleware');

router.get('/login',isGuest, (req, res) => {
    res.render('login');
});

router.get('/register',isGuest, (req, res) => {
    res.render('register');
});

router.get('/logout',isAuth, (req, res) => {
    res.clearCookie(sessionName);
    res.redirect('/');
});
//                                          msg is not required
router.post('/register',isGuest, 
body('password', 'Password must be at least 4 characters long').isLength({min: 4}),
body('email', 'Email should be at least 10 characters long').isLength({min: 10}), 
body('username', 'Username must be at least 5 characters long').isLength({min: 5}),
async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('register', {error: errors.array()[0].msg});
    }

    const user = req.body;
    const users = await userService.getAll().lean();
    const userExists = users.find(u => u.username === user.username);

    if(userExists) {
        return res.render('register', {error: 'User already exists'});
    }else{
        if(user.password === user.rePass){
            user.password = await bcrypt.hash(user.password, 10)
            await userService.register(user);
            res.redirect('/');

        }else{
            return res.render('register', {error: 'Passwords do not match'});
        }
    };
});

router.post('/login',isGuest, async (req, res) => {
    const user = req.body;
    const userExists = await userService.login(user.email);

    if(userExists){
        const isValid = await bcrypt.compare(user.password, userExists.password);

        if(isValid){
            const token = await userService.createToken(userExists);
            res.cookie(sessionName, token, {httpOnly: true});
            res.redirect('/');
        }else{
            return res.render('login', {error: 'Invalid password'});
        }
    }else{
        return res.render('login', {error: 'User does not exist'});
    }

    
});


module.exports = router;
