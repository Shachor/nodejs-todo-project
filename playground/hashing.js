const {SHA256} = require('crypto-js');


var message = 'Look at me, user number 3';
var hash = SHA256(message).toString();    // This turns message into a hash using SHA256

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);


var data = {
   id: 4
};

var token = {
   data: data,
   hash: SHA256(JSON.stringify(data) + 'theSecretSalt').toString(),  // Use JSON.stringify because data is an object
};


// ===== Man in the middle ======
// Attacker is trying to change the data id in the token object then rehash to trick app
// But because we use the SALT, the hash will never be accepted. He would need to know the SALT to spoof the hash
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();



// This checks the result to ensure that no one changed your data
var resultHash = SHA256(JSON.stringify(token.data) + 'theSecretSalt').toString();
if (resultHash === token.hash) {
   console.log('Data was not changed');
} else {
   console.log('Someone jacked yo data!!');
}

// hash the string + salt


// JSON WEB TOKEN - JWT
