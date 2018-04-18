const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);//put mongo in charge of session storage

const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

mongoose.connect('mongodb://localhost/authdb')
  .then(() => {
    console.log('\n=== connected to MongoDB ===\n');
  }).catch(err => console.log('connection failed', err))


const server = express();

server.use(express.json());

server.use(session({
  name: 'auth',
  resave: true,
  saveUninitialized: false,
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, // miliseconds
  secure: false,
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',//defining store database
    ttl: 10 * 60, // session lifespan in seconds
  }),
})
);//express session middleWare

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
