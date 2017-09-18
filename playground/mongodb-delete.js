
// const MongoClient = require('mongodb').MongoClient;
// We use destructuring to pull the MongoCLient and ObjectID out of mongodb
const {MongoClient, ObjectID} = require('mongodb');




MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to Database Server.');
  }
  console.log('Connected to MongoDB Server.');

//deleteMany
// db.collection('Todos').deleteMany({text: 'Some mor text'}).then((result) => {
//   console.log(result);
// });

//deleteOne
// db.collection('Todos').deleteMany({text: 'some text'}).then((result) => {
//   console.log(result);
// });

//findOneAndDelete
// db.collection('Todos').findOneAndDelete({completed: true}).then((result) => {
//   console.log(result);
// })

  // db.close();

  // db.collection('Users').deleteMany({username: 'You'}).then((result) => {
  //   console.log(result);
  // })

  db.collection('Users').findOneAndDelete({username: 'Joy'}).then((result) => {
    console.log(result);
  })

});
