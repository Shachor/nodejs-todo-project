const mongoose = require('mongoose');

// Mongoose uses callbacks by default, but we can force use of built-in JS Promises with this line
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {useMongoClient: true});
// The process.env.MONGODB_URI is the Heroku environment variable for mLab

module.exports = {mongoose};
