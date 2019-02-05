const jwt = require('jsonwebtoken')
const { Token } = require('../models/token')

let authenticate = (req, res, next) => {
  let rawToken = req.header('x-auth')

  let unvalidatedHeader = jwt.decode(rawToken)

  let unvalidatedTokenId = unvalidatedHeader._id
  let unvalidatedUserType = unvalidatedHeader.userType
  let unvalidatedAccessTypes = unvalidatedHeader.access

  if (unvalidatedAccessTypes.indexOf(req.userType) > -1) { // contains required permissions
    Token.validateToken(rawToken, unvalidatedUserType, unvalidatedTokenId).then((doc) => {
      req.user = doc

      next()
    }).catch(() => {
      res.status(401).send()
    })
  } else {
    console.log('invalid permissions')
    res.status(401).send('Improper permissions')
  }
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
