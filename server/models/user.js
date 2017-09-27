const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


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
// This is our own created Instance method section
// We use regular functions because arrow functions cannot manpulate (this) keyword
//============================================================================




//============================================================================
// OVERRIDE METHODS
//============================================================================
// This function will LIMIT the USER data being returned to a webpage
// We don't need them to have access to PASSWORD or TOKEN data
UserSchema.methods.toJSON = function() {
   var user = this;
   var userObject = user.toObject();   // Takes mongoose variable and converts to regular object where only properties available on document exist

   // We use _.pick to take ONLY the data we want to display (email, and _id)
   return _.pick(userObject, ['_id', 'email']);
};

//============================================================================





//============================================================================
// CUSTOM METHODS
//============================================================================

// *** INSTANCE METHODS ******************************************************
// ***************************************************************************
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




// *** MODEL METHODS *********************************************************
// ***************************************************************************
// Using .statics makes this a MODEL method instead of an INSTANCE method (We use it with User instead of user.)
UserSchema.statics.findByToken = function(token) {
   var User = this;
   var decoded;   // Leaving it undefined allows us to use try/catch on jwt.verify, capturing any errors that pop up

   try{
      // If the token is good, will populate decoded with the user data
      decoded = jwt.verify(token, 'SecretValue');
   } catch (e) {
      // This will return a Promise with the reject() method, telling server.js that the token is unauthorized
      // return new Promise((resolve, reject) => {
      //    reject();
      // });
      return Promise.reject();   //If you return with a value, that value becomes (e) in the catch call in server.js
   }


   return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth',
   });
};

// MODEL METHOD TO AUTHENTICATE BY USER CREDENTIALS
UserSchema.statics.findByCredentials = function(email, password) {
   var User = this;

   // Needed to put return in front of this call for it to work, otherwise
   // the call to findByCredentials returns an undefined to the original call.
   return User.findOne({email}).then((user) => {
      if (!user) {
         return Promise.reject();
      }
      // bcrypt does not use Promises, only callbacks. We have used Promises all
      // through the program and we'll keep using them here.
      // By returning a new Promise, we are wrapping the bcrypt method inside a
      // Promise. If bcrypt succeeds it RESOLVES the Promise. If it fails, it REJECTS
      // the Promise.
      return new Promise((resolve, reject) => {
         bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
               // console.log(user);
               resolve(user);
            } else {
               reject();
            }
         });
      });

   });
};

//============================================================================




//============================================================================
// USER PASSWORD HASHING
//============================================================================
// This pre function will create the password hash for the user
UserSchema.pre('save', function(next) {
   var user = this;

   // We need to check if the password was modified so we don't hash a hash.
   if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
         bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
         });
      });
   } else {
      next();
   }
});

// =============================================================================



// We create the Schema to allow us to define custom methods
// But then we pass it into the User var as a mongoose model.
// This gets passed into the app in order to create and maintain users.
var User = mongoose.model('User', UserSchema);

module.exports = {User};
