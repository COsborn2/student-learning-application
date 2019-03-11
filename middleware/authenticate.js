const jwt = require('jsonwebtoken')
const { Token } = require('../models/token')
const { InfoMessage, SuccessMessage, ErrorMessage } = require('./message')
const _ = require('lodash')

let authenticate = async (req, res, next) => {
  let rawToken = req.header('x-auth')

  if (_.isUndefined(rawToken)) {
    ErrorMessage('No token provided')
    return res.send('token not provided')
  }

  let unvalidatedToken

  try {
    unvalidatedToken = jwt.decode(rawToken)
  } catch (error) {
    ErrorMessage(error)
    return res.status(401).send({ error: error.message })
  }

  let unvalidatedAccessTypes

  try {
    unvalidatedAccessTypes = unvalidatedToken.access
  } catch (error) {
    ErrorMessage(error.message)
    return res.send(401).send({ error: 'No token provided' })
  }

  if (!(unvalidatedAccessTypes.indexOf(req.userType) > -1)) {
    ErrorMessage('invalid permissions')
    return res.status(401).send('Improper permissions')
  }

  if (req.userType !== unvalidatedToken.userType) {
    const err = `Requested authentication of user type (${req.userType}) is not equal to token user type (${unvalidatedToken.userType})`
    ErrorMessage(err)
    return res.status(401).send({ error: err })
  }

  try {
    let user = await Token.validateToken(rawToken, unvalidatedToken)
    req.user = user

    SuccessMessage('Authenticated')
    next()
  } catch (error) {
    ErrorMessage(error)
    return res.status(401).send({ error: 'Token is invalid' })
  }
}

let authenticateStudent = (req, res, next) => {
  InfoMessage('Authenticating Student')
  req.userType = 'Student'

  authenticate(req, res, next)
}

let authenticateInstructor = (req, res, next) => {
  InfoMessage('Authenticating Instructor')
  req.userType = 'Instructor'

  authenticate(req, res, next)
}

module.exports = { authenticateStudent, authenticateInstructor }
