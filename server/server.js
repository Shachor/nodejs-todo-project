require('./config/config');   // DB ENV VARIABLES

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

// Require mongoose from the mongoose.js file. Using the ES6 destructuring method
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT; // || 3000;

// Mongoose connect info moved to db/mongoose.js

// Todo Model moved to models/todo.js

// User model moved to models/user.js


// SET UP MIDDLEWARE
app.use(bodyParser.json());

// SET UP ROUTES

//===========================================================================
// GET and POST Routes
//===========================================================================
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
  }

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
//===========================================================================
// END GET and POST Routes
//===========================================================================



//===========================================================================
// UPDATE Routes
//===========================================================================
app.patch('/todos/:id', (req, res) => {
  // Grab the id from the requesting page
  var id = req.params.id;
  // Use lodash.pick to pull an array of ONLY the text and completed
  // properties from the requesting page's body, then put that Object
  // into the var body. This means a user will ONLY be able to UPDATE
  // those properties and nothing else.
  var body = _.pick(req.body, ['text', 'completed']);
  // console.log({body});

  // Make sure ObjectID is valid
  if (!ObjectID.isValid(id)) {
    console.log('BAD OID');
    return res.status(404).send('BAD OID');
  }

  // Check for completed property and function accordingly
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // Update the todo with data in body variable. Remember to use $set
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      console.log('NO DOCUMENT FOUND');
      return res.status(404).send('NO DOCUMENT FOUND');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});
//===========================================================================
// END UPDATE Routes
//===========================================================================





//===========================================================================
// DELETE Routes
//===========================================================================
app.delete('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id;
  //validate the id
  if (!ObjectID.isValid(id)) {
    //return 404 if not valid
    return res.status(404).send();
  }

  //remove todo by id
  Todo.findByIdAndRemove(id).then((todo) => {
    //success - if no doc, send 404. if doc send doc back with 200
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e) => res.status(400).send()); //error - send 400 and no body
});
//===========================================================================
// END DELETE Routes
//===========================================================================



//===========================================================================
// USER Routes
//===========================================================================
// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

// Model methods - Called on the model - User
   // User.findByToken (Model method)
// Instance methods - called on individual objects - user
   // user.generateAuthToken (instance method)

   // This will save the user in the db, generate the token, then send
   // the user back to the page
   user.save().then(() => {
      return user.generateAuthToken(); //This returns the TOKEN from the Promise in defined instance method
   }).then((token) => {    // This USES the returned TOKEN.
      res.header('x-auth', token).send(user);   // The .header() sends data to page. x-auth is custom header sending back token data
   }).catch((e) => {
      res.status(400).send(e);
   });

});


//===========================================================================
// END USER Routes
//===========================================================================








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
