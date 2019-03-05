const mongoose = require('mongoose')

let AssignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  videos: {
    type: [String],
    trim: true,
    minlength: 1
  },
  letters: {
    type: [String],
    required: true,
    maxlength: 1,
    trim: true
  },
  words: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word'
  }]
})

AssignmentSchema.statics.findByLetter = async function (letter) {
  return Assignment.findOne({ letters: letter })
}

let Assignment = mongoose.model('Assignment', AssignmentSchema)

module.exports = { Assignment }
