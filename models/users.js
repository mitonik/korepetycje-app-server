const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String
  },
  surname: {
    type: String
  },
  age: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  img: {
    type: String
  },
  description: {
    type: String
  },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;