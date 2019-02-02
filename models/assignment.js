const mongoose = require('mongoose')

let AssignmentSchema = new mongoose.Schema({
  letters: [{
    type: String,
    required: true,
    maxlength: 1,
    trim: true
  }],
  words: [{
    type: mongoose.Schema.Types.ObjectId
  }]
})

let Assignment = mongoose.model('Assignment', AssignmentSchema)

module.exports = { Assignment }
