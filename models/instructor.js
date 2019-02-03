const mongoose = require('mongoose')
const validator = require('validator')

let InstructorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  hashedPassword: {
    type: String,
    required: true,
    minlength: 6
  },
  salt: {
    type: String,
    required: true,
    minlength: 10
  },
  token: {
    type: mongoose.Schema.Types.ObjectId
  }
})

let Instructor = mongoose.model('Instructor', InstructorSchema)

module.exports = { Instructor }
