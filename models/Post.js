const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  interestedIn: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    }
  ],
  title: {
    type: String,
    minLength: 1,
    maxlength: 64
  },
  price: Number,
  cities: [
    {
      type: String
    }
  ],
  subjects: [
    {
      type: String,
      enum: [
        "math",
        "physics",
        "biology",
        "chemistry",
        "geography",
        "art",
        "computer science",
        "polish",
        "english",
        "german",
        "spanish",
        "japanese",
        "french",
        "russian",
        "history"
      ]
    }
  ],
  level: [
    {
      type: String,
      enum: [
        "primary school",
        "middle school",
        "high school",
        "university"
      ]
    }
  ],
  dateFrom: Date,
  dateTo: Date
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
