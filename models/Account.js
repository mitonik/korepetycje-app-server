const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const accountSchema = new Schema({
  accountName: {
    type: String,
    required: true,
    minLength: 1,
    maxlength: 64,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minLength: 1,
    maxlength: 64
  },
  email: {
    type: String,
    lowercase: true,
    minLength: 1,
    maxlength: 64
  },
  firstName: {
    type: String,
    minLength: 1,
    maxlength: 64
  },
  lastName: {
    type: String,
    minLength: 1,
    maxlength: 64
  },
  address: String,
  about: {
    type: String,
    maxlength: 256
  },
  phoneNumber: String,
  birthday: Date
}, { timestamps: true });

accountSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

accountSchema.statics.login = (accountName, password) => {
  return new Promise((resolve, reject) => {
    Account.findOne({ accountName })
      .then(async (account) => {
        if (await bcrypt.compare(password, account.password)) {
          resolve(account);
        }
        else {
          reject("Wrong password");
        }
      })
      .catch(() => {
        reject("Error");
      })
  })
}

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
