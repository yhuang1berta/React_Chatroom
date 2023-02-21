/* Hashing */
'use strict';
const log = console.log

const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs')


// SHA256 one-way hash
// data given to server
const sensitiveServerData = {
  id: 4
};
// the hash is stored
const serverHash = SHA256(JSON.stringify(sensitiveServerData)).toString();

// can also 'salt' the hash to make it more secure.
//const serverHash = SHA256(JSON.stringify(sensitiveServerData) + "somesalt").toString();

// client sends along data
const clientData = {
  id: 5
};

// the server might then check if the hash of the server data is the same as the client's
const clientHash = SHA256(JSON.stringify(clientData)).toString()
if (serverHash === clientHash) {
  log('Data was not changed');
} else {
  log('Data was changed. Do not trust!');
}


// Bcrypt and salting
var password = 'myPassword';

// Salt is generated to make encryption more secure.
bcrypt.genSalt(10, (err, salt) => {
  // password is hashed with the salt
  bcrypt.hash(password, salt, (err, hash) => {
    log(hash);
  });
});

// (put the hashed password from above here)
var hashedPassword = '$2a$10$ey71Fs8bjIseqpFV0iR2zOpUAraXsNiNyiAajK1rXy06i8YIywnVe';

// Bcrypt will figure out if the original password matches the hash with the salt.
bcrypt.compare('myPassword', hashedPassword, (err, res) => {
  console.log('Bcripy result:', res);
});



