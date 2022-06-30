const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/crypto-platform';

exports.initDatabase = () => mongoose.connect(connectionString);
