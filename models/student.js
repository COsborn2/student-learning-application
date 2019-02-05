const mongoose = require('mongoose')
const { TokenSchema } = require('./token')
const _ = require('lodash')

let StudentSchema = new mongoose.Schema({
  classcode: {
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
  token: TokenSchema
})

StudentSchema.methods.toJSON = function () {
  let student = this
  let studentObject = student.toObject()

  return _.pick(studentObject, ['classcode', 'username'])
}

let Student = mongoose.model('Student', StudentSchema)

module.exports = { Student }
