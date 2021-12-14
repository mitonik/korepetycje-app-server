const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name: String,
  surname: String,
  age: String,
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
  phone: String,
  img: String,
  description: String,
}, {timestamps: true});

userSchema.pre('save', async function (next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

userSchema.statics.login = (email, password) => {
  return new Promise ( (resolve, reject) => {
    let user = User.findOne({email})
    .then( async (user) => {
      let wynik = await bcrypt.compare(password, user.password);
      if (wynik) {
        resolve(user);
      }
      else {
        reject(":(");
      }
    })
    .catch(() => {reject(":(");})
  })
}

const User = mongoose.model('User', userSchema);

module.exports = User;
