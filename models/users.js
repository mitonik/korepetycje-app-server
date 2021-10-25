const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String
  },
  img: {
    type: String
  },
  age: {
    type: String
  },
  description: {
    type: String
  },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;