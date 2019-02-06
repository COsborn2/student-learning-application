const mongoose = require('mongoose')
const validator = require('validator')
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
  token: TokenSchema
})

StudentSchema.methods.toJSON = function () {
  let student = this
  let studentObject = student.toObject()

  return _.pick(studentObject, ['username', 'classcode'])
}

let Student = mongoose.model('Student', StudentSchema)

module.exports = { Student }
