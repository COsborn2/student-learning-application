const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

TokenSchema.statics.generateAuthToken = function (access) {
  console.log(access)

  let Token = this  

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err)
      }

      let tokenId = mongoose.Types.ObjectId()

      let tokenVal = jwt.sign({ _id: tokenId, access }, salt, { expiresIn: '4h' }).toString()

      let token = new Token({
        _id: tokenId,
        token: tokenVal,
        access,
        salt
      })

      resolve(token)
    })
  })
}

let Token = mongoose.model('Token', TokenSchema)

module.exports = { Token, TokenSchema }
