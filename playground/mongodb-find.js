
// const MongoClient = require('mongodb').MongoClient;
// We use destructuring to pull the MongoCLient and ObjectID out of mongodb
const {MongoClient, ObjectID} = require('mongodb');




MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to Database Server.');
  }
  console.log('Connected to MongoDB Server.');

  // toArray returns a Promise so we can use then() to fulfill the Promise
  // find() returns a Cursor by default. mongodb.github.io has information on how to
  // handle cursor. toArray() is just one method.
  // db.collection('Todos').find({completed: false}).toArray().then((docs) => {

  // To search by _id you need to create a new ObjectID object with the ID you want.
  // db.collection('Todos').find({_id: new ObjectID('59bc1c620f23f71e7c74c943')}).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log(err);
  // });
  //
  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  //   // console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log(err);
  // });

  db.collection('Users').find({username: 'You'}).toArray().then((docs) => {
    console.log('Users');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log(err);
  });


  // db.close();
});
