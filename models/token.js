const mongoose = require('mongoose')

let TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  access: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
})

let Token = mongoose.model('Token', TokenSchema)

module.exports = { Token }
