const mongoose = require('mongoose')
const validator = require('validator')
const { TokenSchema } = require('./token')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const jwt = require('jsonwebtoken')

let InstructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
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
  class: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom'
  }],
  token: TokenSchema
})

InstructorSchema.methods.toJSON = function () {
  let instructor = this
  let instructorObject = instructor.toObject()

  return _.pick(instructorObject, ['name', 'email', 'class'])
}

InstructorSchema.methods.hashPassword = function () {
  let instructor = this

  // replace password with hashed password
  let unhashedPassword = instructor.hashedPassword

  return new Promise((resolve, reject) => {
    bcrypt.hash(unhashedPassword, 12, (err, hash) => {
      if (err) {
        reject(err)
      }

      instructor.hashedPassword = hash

      resolve()
    })
  })
}

// NOTE: This does NOT check if the token is authenticated
InstructorSchema.statics.findByToken = function (token) {
  let decoded = jwt.decode(token)

  let instructorId = decoded._mid

  return Instructor.findById(instructorId).populate('class')
}

let Instructor = mongoose.model('Instructor', InstructorSchema)

module.exports = { Instructor }
