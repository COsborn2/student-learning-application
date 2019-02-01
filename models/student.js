const mongoose = require('mongoose')

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
  }
})

let Student = mongoose.model('Student', StudentSchema)

module.exports = { Student }
