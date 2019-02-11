const jwt = require('jsonwebtoken')
const { Token } = require('../models/token')
const _ = require('lodash')

let authenticate = (req, res, next) => {
  let rawToken = req.header('x-auth')

  if (_.isUndefined(rawToken)) {
    console.error('no token provided')
    return res.send('token not provided')
  }

  let unvalidatedHeader = jwt.decode(rawToken)

  let unvalidatedTokenId = unvalidatedHeader._id
  let unvalidatedUserType = unvalidatedHeader.userType
  let unvalidatedAccessTypes = unvalidatedHeader.access

  if (!(unvalidatedAccessTypes.indexOf(req.userType) > -1)) {
    console.log('invalid permissions')
    return res.status(401).send('Improper permissions')
  }

  Token.validateToken(rawToken, unvalidatedUserType, unvalidatedTokenId).then((doc) => {
    req.user = doc

    next()
  }).catch(() => {
    return res.status(401).send()
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
