const mongoose = require('mongoose')

let AssignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  letters: {
    type: [String],
    required: true,
    maxlength: 1,
    trim: true
  },
  words: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word',
    required: true
  }]
})

let Assignment = mongoose.model('Assignment', AssignmentSchema)

module.exports = { Assignment }
