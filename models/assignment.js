const mongoose = require('mongoose')

let AssignmentSchema = new mongoose.Schema({
  order: { // what place the assignment falls in the course
    type: number,
    required: true
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

let Assignment = mongoose.model('Assignment', AssignmentSchema)

module.exports = { Assignment }
