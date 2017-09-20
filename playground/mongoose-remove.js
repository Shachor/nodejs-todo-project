const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// We do not get a document back, only a number removed.
// Todo.remove({}).then((result) => {
//   console.log(result);
// });


// This will return the deleted document data for us to work with
// Todo.findOneAndRemove({_id: '59c2f1b03e84dd54944f1409'}).then((todo) => {
//   console.log(todo);
// });

Todo.findByIdAndRemove('59c2f1b03e84dd54944f1409').then((todo) => {
  console.log(todo);
});
