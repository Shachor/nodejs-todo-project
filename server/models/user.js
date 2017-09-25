const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// This will store all the properties of our User Model
// It will allow us to create custom methods such as User.findByToken()
var UserSchema = new mongoose.Schema({
   email: {
     type: String,
     required: true,
     minlength: 1,
     trim: true,
     unique: true,
     validate: {
       validator: validator.isEmail,
       message: '{VALUE} is not a valid email'
     }
   },
   password: {
     type: String,
     required: true,
     minlength: 6,
   },
   tokens: [{
     access: {
       type: String,
       required: true,
     },
     token: {
       type: String,
       required: true,
     },
   }]
});


// =============================================================================
// This is our own created Instance method
// We use regular functions because arrow functions cannot manpulate (this) keyword

// This function will LIMIT the USER data being returned to a webpage
// We don't need them to have access to PASSWORD or TOKEN data
UserSchema.methods.toJSON = function() {
   var user = this;
   var userObject = user.toObject();   // Takes mongoose variable and converts to regular object where only properties available on document exist

   // We use _.pick to take ONLY the data we want to display (email, and _id)
   return _.pick(userObject, ['_id', 'email']);

};




// This is our custom method to generate a TOKEN then pass that token on to server.js
UserSchema.methods.generateAuthToken = function() {
   var user = this;
   var access = 'auth';
   // jwt.sign requires object which will be hashed {_id, access} plus secret Salt
   var token = jwt.sign({_id: user._id.toHexString(), access}, 'SecretValue').toString();

   // This will update the user by pushing token and access data into tokens array in user model.
   user.tokens.push({
      access,
      token,
   });

   // This will save the user and return the token to server.js using the Promise
   return user.save().then(() => {
      return token;  // this value will get returned as teh success argument for the Promise.
                     // It is then usable by the next .then() call, which will happen in server.js
   });
};
// =============================================================================



// We create the Schema to allow us to define custom methods
// But then we pass it into the User var as a mongoose model.
// This gets passed into the app in order to create and maintain users.
var User = mongoose.model('User', UserSchema);

module.exports = {User};
