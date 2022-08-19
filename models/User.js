const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  pwd: String,
  admin: { type: String, default: 'no' }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

