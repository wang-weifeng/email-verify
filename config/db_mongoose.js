const mongoose = require('mongoose');
const user_mongoose = mongoose.createConnection('mongodb://localhost:27017/email');

module.exports = user_mongoose;