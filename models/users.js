const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minLength: 3
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

userSchema.pre('save', async function (next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');

}

/*userSchema.post('save', function (doc, next){
  console.log('new user was created and saved', doc);
  next();
})*/

const User = mongoose.model('User', userSchema);

module.exports = User;
