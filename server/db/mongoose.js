const mongoose = require('mongoose');

// Mongoose uses callbacks by default, but we can force use of built-in JS Promises with this line
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true});


module.exports = {mongoose};
