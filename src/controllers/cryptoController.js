const router = require('express').Router();
const cryptoService = require('../services/cryptoService');
const {body, validationResult} = require('express-validator');
const {isAuth} = require('../middlewares/authMiddleware');

router.get('/catalog', async (req, res) => {
    const cryptos = await cryptoService.getAll().lean();
    res.render('catalog', {cryptos});
});

router.get('/create',isAuth, (req, res) => {
    res.render('create');
});

router.post('/create',isAuth, 
body('name', 'Name should be at least 2 characters long').isLength({min: 2}),
body('price', 'Price should be a positive number').isNumeric({min: 0}),
body('image', 'Image should start with http:// or https://').isURL(),
body('description', 'Description should be at least 10 characters long').isLength({min: 10}),
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('create', {error: errors.array()[0].msg});
    }

    const crypto = req.body;
    crypto.owner = req.user._id;

    await cryptoService.create(crypto);
    res.redirect('/offers/catalog');
});

router.get('/details/:id', async (req, res) => {
    const id = req.params.id;
    const crypto = await cryptoService.getOne(id).lean();

    if(req.user){
        const isOwner = crypto.owner.toString() === req.user._id.toString();
        const buyers = crypto.boughtCrypto;
        const isBought = buyers.some(b => b.toString() === req.user._id.toString());

        res.render('details', {crypto, isOwner, isBought});
    }else{
        res.render('details', {crypto});
    }
});

router.get('/buy/:id',isAuth, async (req, res) => {
    let offerId = req.params.id;
    let userId = req.user._id;

    await cryptoService.buy(offerId, userId);
    res.redirect('/offers/details/' + offerId);
});

router.get('/delete/:id',isAuth, async (req, res) => {
    let id = req.params.id;
    await cryptoService.delete(id);
    res.redirect('/offers/catalog');
});

router.get('/edit/:id',isAuth, async (req, res) => {
    const crypto = await cryptoService.getOne(req.params.id).lean();
    crypto[`payment${crypto.payment}`] = true;
    res.render('edit', {crypto});
});

router.post('/edit/:id',isAuth, async (req, res) => {
    const crypto = req.body;
    await cryptoService.edit(req.params.id, crypto);
    res.redirect('/offers/details/' + req.params.id);
});

router.get('/search', async (req, res) => {
    const cryptos = await cryptoService.getAll().lean();
    res.render('search', {cryptos});
});

router.post('/search', async (req, res) => {
    const search = req.body;
    const cryptos = await cryptoService.search(search?.name, search?.payment).lean();
    res.render('search', {cryptos});
});

module.exports = router;