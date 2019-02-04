const mongoose = require('mongoose')
const { Token, TokenSchema } = require('./token')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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

StudentSchema.methods.generateTokenAndSave = function (callback) {
  console.log('generating token and saving')

  let student = this
  let access = 'Student'

  bcrypt.genSalt(12, (err, salt) => {
    if (err) {
      return Promise.reject(new TypeError())
    }

    let tokenId = mongoose.Types.ObjectId()

    let tokenVal = jwt.sign({ _id: tokenId, access }, salt).toString()

    let token = new Token({
      _id: tokenId,
      token: tokenVal,
      access,
      salt
    })

    student.token = token

    student.save()

    callback()
  })
}

let Student = mongoose.model('Student', StudentSchema)

module.exports = { Student }
