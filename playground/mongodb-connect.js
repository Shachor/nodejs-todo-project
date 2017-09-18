
// const MongoClient = require('mongodb').MongoClient;
// We use destructuring to pull the MongoCLient and ObjectID out of mongodb
const {MongoClient, ObjectID} = require('mongodb');

// Create a new instance of ObjectID
// var obj = new ObjectID();
// console.log(obj);

// Object destructuring (ES6 feature) let's you pull out properties from object creating
// variables.
// !!!!!!A GREAT WAY TO MAKE NEW VARIABLES FROM OBJECT PROPERTIES!!!!!
// var user = {name: 'Matt', age: 41};
// // Pull the name out of user object and create new name variable with it.
// var {name} = user;
// console.log(name);


MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to Database Server.');
  }
  console.log('Connected to MongoDB Server.');

  // db.collection('Todos').insertOne({
  //   text: 'Lern how 2 code in teh Mongo, durrr',
  //   completed: false,
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Error inserting record.', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   username: 'You',
  //   password: 'ohyeah!',
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Error inserting record.', err);
  //   }
  //   // result.ops is an array of all the documents that got inserted
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  // });

  db.close();
});
