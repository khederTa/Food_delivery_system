const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ContactSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  title: String,
  message: String
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;

