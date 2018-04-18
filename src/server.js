const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const bcrypt = require('bcrypt');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

server.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));//express session middleWare

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

// TODO: implement routes

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, passwordHash: password });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(err => sendUserError(err, res));
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({})
  }
})

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
