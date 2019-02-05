const mongoose = require('mongoose')
const { TokenSchema } = require('./token')

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

let Student = mongoose.model('Student', StudentSchema)

module.exports = { Student }
