const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjects: [
    { type: String }
  ],
  time: Date,
  usersInterested: [
    { type: String }
  ],
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;