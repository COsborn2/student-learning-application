const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

let User = mongoose.model('User', UserSchema)

module.exports = { User }
