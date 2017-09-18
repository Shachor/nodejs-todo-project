
// const MongoClient = require('mongodb').MongoClient;
// We use destructuring to pull the MongoCLient and ObjectID out of mongodb
const {MongoClient, ObjectID} = require('mongodb');




MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to Database Server.');
  }
  console.log('Connected to MongoDB Server.');


  //findOneAndUpdate
  // This one uses many arguments.
  // findOneAndUpdate(filter, update, options, callback(OR PROMISE))
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('59bf3f78660cfb5f4fd72d7c')   // This is the FILTER
  // }, {
  //   $set: {               // This is UPDATE section. MUST USE $set, THEN the updated value
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false   // This OPTION will return updated document instead of original.
  // })
  // .then((result) => {       // Instead of callback we call the PROMISE
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    username: 'Me'
  }, {
    $set: {
      username: 'Matt'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  })
  .then((result) => {
    console.log(result);
  });

});
