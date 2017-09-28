// ADDING MODULE DEPENDENCIES
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

// ADDING OBJECT DEPENDENCIES
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');


// ==========================================================================
// SETUP DATABASE TESTING ENVIRONMENT
// ==========================================================================

// CREATE TEST USER DATA
const userOneId = new ObjectID();   //required here so we can call in jwt.sign()
const userTwoId = new ObjectID();
const users = [{
   // First user will have valid token
   _id: userOneId,
   email: 'tester1@test.com',
   password: 'password1',
   tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
   }]
}, {
   // Second user will not have auth token, useful for testing failure cases
   _id: userTwoId,
   email: 'tester2@test.com',
   password: 'password2',
   tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
   }]
}];


// CREATE TEST TODOS DATA TO FILL DATABASE
const todos = [{
  _id: new ObjectID(),
  text: "First test item",
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: "Second test item",
  completed: true,
  completedAt: 69,
  _creator: userTwoId
// }, {
//   _id: new ObjectID(),
//   text: "THIRD test item"
}];






// REMOVE ENTRIES FROM DB THEN REPOPULATE WITH TEST DATA
const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};


const populateUsers = (done) => {
   User.remove({}).then(() => {
      // This will create two Promises that WILL call the hashing middleware
      // insertMany() would never call the hash. We needed to use .save() so
      // that the .pre() method in our User model would be called.
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();


      // This waits for all Promises in array to finish THEN returns,
      // allowing the chained then() to call done()
      return Promise.all([userOne, userTwo]);
   }).then(() => done());
};

// ==========================================================================

module.exports = {todos, populateTodos, users, populateUsers};
