const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  userMain: {
    type: User,
    required: true
  },
  subjects: {
    type: {type: String}
  },
  time: {
    type: {type: Date}
  },
  usersInterested: {
    type: {type: String}
  },
}, {timestamps: true});

offerSchema.post('save', function (doc, next){
    console.log('new offer was created and saved', doc)
    next();
  })

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;