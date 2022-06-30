const cookieParser = require('cookie-parser');
const express = require('express');
const {initDatabase} = require('./config/database');

const { auth } = require('./middlewares/authMiddleware');

const routes = require('./routes');

const app = express();
require('./config/handlebars')(app);

app.use(express.urlencoded({extended: false}));

app.use('/static', express.static('public'));

app.use(cookieParser());

app.use(auth);

app.use(routes);

initDatabase()
.then(() => {
    app.listen(3000, () => console.log('App is listening on port 3000...'));
    console.log('Database connected');
})
.catch((err) => {
    console.log('Cannot connect to DB ',err);
});