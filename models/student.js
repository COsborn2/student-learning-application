const mongoose = require('mongoose')
const { TokenSchema } = require('./token')
const _ = require('lodash')

let StudentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  classcode: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  currentAssignment: {
    type: Number,
    default: 0
  },
  currentLetter: {
    type: Number,
    default: 0
  },
  currentWord: {
    type: Number,
    default: 0
  },
  token: TokenSchema
})

StudentSchema.methods.toJSON = function () {
  let student = this
  let studentObject = student.toObject()

  return _.pick(studentObject, ['username', 'classcode'])
}

let Student = mongoose.model('Student', StudentSchema)

module.exports = { Student }
