const {Crypto} = require('../models/Crypto');

exports.create = (crypto) => Crypto.create(crypto);

exports.getAll = () => Crypto.find();

exports.getOne = (id) => Crypto.findById(id);

exports.buy = (id, userId) => Crypto.findByIdAndUpdate(id, {$push: {boughtCrypto: userId}});

exports.delete = (id) => Crypto.findByIdAndDelete(id);

exports.edit = (id, crypto) => Crypto.findByIdAndUpdate(id, crypto);

exports.search = (name, payment) => Crypto.find({name: {$regex: name, $options: 'i'}, payment: {$regex: payment, $options: 'i'}});