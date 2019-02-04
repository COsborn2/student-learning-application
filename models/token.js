const mongoose = require('mongoose')

let TokenSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  access: {
    type: String,
    required: true,
    trim: true
  },
  salt: {
    type: String,
    required: true
  }
})

let Token = mongoose.model('Token', TokenSchema)

module.exports = { Token, TokenSchema }
