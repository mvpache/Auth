const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  username: {
    required: true,
    type: String,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  }
});

UserSchema.pre('save', function(next) {
  console.log('preSave');
  bcrypt.hash(this.passwordHash, 11, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.passwordHash = hash;

    return next();
  });
});

UserSchema.methods.isPasswordValid = function(passwordGuess) {
  return bcrypt.compare(passwordGuess, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);