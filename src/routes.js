const router = require('express').Router();
const userController = require('./controllers/userController');
const homeController = require('./controllers/homeController');
const cryptoController = require('./controllers/cryptoController');
const controller404 = require('./controllers/controller404');

router.use('/', homeController);
router.use('/user', userController);
router.use('/offers', cryptoController);
router.use('*', controller404);

module.exports = router;