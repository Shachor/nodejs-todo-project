const express = require('express');
const bodyParser = require('body-parser');

// Require mongoose from the mongoose.js file. Using the ES6 destructuring method
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');

var app = express();

// Mongoose connect info moved to db/mongoose.js

// Todo Model moved to models/todo.js

// User model moved to models/user.js


// SET UP MIDDLEWARE
app.use(bodyParser.json());

// SET UP ROUTES
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });

});




app.listen(3000, () => {
  console.log('Starting Server on port 3000');
});


// USED FOR TESTING
module.exports = {app};


//=============================================================================
// TODOS LOGIC
//=============================================================================

// Now we add a single Todo
// var newTodo = new Todo({
//   text: 'Fight the Man'
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved Todo', doc);
// }, (e) => {
//   console.log('Unable to save Todo');
// });


// var newTodo = new Todo({
//   text: 'Wake the hell up',
//   completed: true,
//   completedAt: 2017
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved Todo', JSON.stringify(doc, undefined, 5));
// }, (e) => {
//   console.log('Unable to save Todo');
// });

// var newUser = new User({
//   username: 'mpliss',
//   email: 'mpliss@test.me'
// });
//
// newUser.save().then((user) => {
//   console.log(JSON.stringify(user, undefined, 5));
// }, (e) => {
//   console.log('Error saving User');
// });
