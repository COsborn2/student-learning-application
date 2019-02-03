const mongoose = require('mongoose')

let WordSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  picture: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

let Word = mongoose.model('Word', WordSchema)

module.exports = { Word, WordSchema }
