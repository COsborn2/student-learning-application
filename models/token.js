const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SuccessMessage, ErrorMessage } = require('../middleware/message')

let TokenSchema = new mongoose.Schema({
  _mid: { // id of associated model
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  access: {
    type: [String],
    required: true,
    trim: true
  },
  userType: {
    type: String,
    required: true,
    trim: true
  },
  salt: {
    type: String,
    required: true
  }
})

TokenSchema.statics.generateAuthToken = function (access, userType, _mid) {
  let Token = this

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err)
      }

      let token = new Token({
        _mid,
        access,
        userType,
        salt
      })

      let tokenVal = jwt.sign({ _id: token._id, userType, access, _mid }, salt, { expiresIn: '4h' }).toString()

      token.token = tokenVal
      resolve(token)
    })
  })
}

TokenSchema.statics.validateToken = function (rawToken, unvalidatedToken) {
  return new Promise(async (resolve, reject) => {
    let userType = unvalidatedToken.userType
    let userId = unvalidatedToken._mid

    // attempt to find user model in DB
    let user = await mongoose.model(userType).findById(userId)

    if (!user) {
      return reject(new TypeError('That user could not be found'))
    }

    try {
      await jwt.verify(rawToken, user.token.salt)
    } catch (error) {
      ErrorMessage(error.message)
      return reject(error)
    }

    SuccessMessage('Token validated')
    return resolve(user)
  })
}

let Token = mongoose.model('Token', TokenSchema)

module.exports = { Token, TokenSchema }
