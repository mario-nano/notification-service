const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.notification = require('./notification.model')(mongoose);

module.exports = db;
