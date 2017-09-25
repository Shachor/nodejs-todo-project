// This app will demonstrate how to use JWT library (JSON Web Token)
const jwt = require('jsonwebtoken');


var data = {
   id: 10
};

// This stores the data hash + salt in var token which will be stored in the user object
var token = jwt.sign(data, 'thisIsASecretSalt');
console.log(token);

// This will verify the token AND teh salt, then decode the data, storing it in var decoded
var decoded = jwt.verify(token, 'thisIsASecretSalt');
console.log('Decoded: ', decoded);

// jwt.sign ---> takes object and signs it (creates hash and returns token value)
// jwt.verify ---> takes data and hash and makes sure ti wasn't manipulated
