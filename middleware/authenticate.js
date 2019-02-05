const jwt = require('jsonwebtoken')
const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')

let authenticate = (req, res, next) => {
  let rawToken = req.header('x-auth')

  let unvalidatedHeader = jwt.decode(rawToken)

  let unvalidatedTokenId = unvalidatedHeader._id
  let unvalidatedUserType = unvalidatedHeader.access

  mongoose.model(unvalidatedUserType).findOne({
    'token._id': unvalidatedTokenId
  }).then((doc) => {
    if (!doc) {
      return Promise.reject(new TypeError())
    }

    let realToken = doc.token
    let realSalt = realToken.salt

    try {
      let decoded = jwt.verify(rawToken, realSalt)

      req.token = decoded
      req.user = doc
      next()
    } catch (error) {
      return Promise.reject(new TypeError('Token validation failed'))
    }
  }).catch(() => {
    res.status(404).send('invalid token')
  })
}

let authenticateStudent = (req, res, next) => {
  console.log('Authenticating Student')
  req.userType = 'Student'

  authenticate(req, res, next)
}

let authenticateInstructor = (req, res, next) => {
  console.log('Authenticating Instructor')
  req.userType = 'Instructor'

  authenticate(req, res, next)
}

module.exports = { authenticateStudent, authenticateInstructor }
