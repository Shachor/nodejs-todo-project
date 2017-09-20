const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '59c1db51820ecf109c672fdb';

//This allows us to determine up front if the id is valid
// if (!ObjectID.isValid(id)) {
//   console.log('Id is not valid');
// }
//
//
// Todo.find({        // Returns an array
//   _id: id
// }).then((todos) => {
//   console.log('Todos: ', todos);
// });
//
//
// Todo.findOne({    // Preferred over .find() because it returns document instead of array
//   _id: id
// }).then((todo) => {
//   console.log('Todo: ', todo);
// });
//
//
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id: ', todo);
// }).catch((e) => console.log(e));  // We can catch the error if the ID is invalid


//===========================================================================
// CHALLENGE
//===========================================================================
var id = '59c014d2d0f3a6130c72e83d';

User.findById(id).then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log(JSON.stringify(user, undefined, 5));
}).catch((e) => {
  console.log(e);
});
