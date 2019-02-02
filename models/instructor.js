const mongoose = require('mongoose')

let InstructorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  username: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

let Instructor = mongoose.model('Instructor', InstructorSchema)

module.exports = { Instructor }
