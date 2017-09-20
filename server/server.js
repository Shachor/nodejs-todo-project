const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Require mongoose from the mongoose.js file. Using the ES6 destructuring method
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});  //Best to send the object instead of array so we can add properties
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  // console.log(id);
  //Validate id using isValid
  // if not valid respond 404 - send back empty send
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  //findById
  Todo.findById(id).then((todo) => {
      if (todo) {
        res.send({todo});
      } else {
        res.status(404).send();
      }
  }, (e) => {
    res.status(400).send();
  });
    //successCase
      //if todo - send it back
      //if no todo - send back 404 with empty body
    //errorCase
      // Error 400 - Request not Valid (send empty)
});

app.delete('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id;
  //validate the id
  if (!ObjectID.isValid(id)) {
    //return 404 if not valid
    return res.status(404).send();
  }

  //remove todo by id
  Todo.findByIdAndRemove(id).then((result) => {
    //success - if no doc, send 404. if doc send doc back with 200
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send(JSON.stringify(result, undefined, 5));
  }).catch((e) => res.status(400).send()); //error - send 400 and no body
});



app.listen(port, () => {
  console.log(`Starting Server on port ${port}`);
});

// var server = app.listen(3000);
// console.log(`Starting Server on port 3000`);

// USED FOR TESTING
module.exports = {
  app
};


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
