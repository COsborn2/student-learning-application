const _ = require('lodash')
const { Token } = require('../models/token')
const { Instructor } = require('../models/instructor')
const { WarningMessage, SuccessMessage, ErrorMessage } = require('../middleware/message')
const bcrypt = require('bcrypt')

let createInstructor = (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])

  let instructor = new Instructor({
    email: body.email,
    hashedPassword: body.password
  })

  Token.generateAuthToken(['Instructor', 'Student'], 'Instructor', instructor._id).then(async (token) => {
    instructor.token = token
    instructor.token._mid = instructor._id

    await instructor.hashPassword()

    instructor.save((err) => {
      if (err) {
        if (err.code === 11000) {
          WarningMessage('User already exists with that email')
          return res.status(400).send({ error: 'User already exists with that email' })
        }
        ErrorMessage(err.message)
        return res.status(400).send({ error: 'error' })
      }
      res.header('x-auth', token.token).send(instructor)
    })
  }).catch((err) => {
    WarningMessage(err)
    return res.status(400).send({ error: 'error' })
  })
}

let loginInstructor = async (req, res) => { // need to find instructor from email
  let body = _.pick(req.body, ['email', 'password'])

  try {
    let instructor = await Instructor.findOne({ email: body.email })

    if (!instructor) {
      throw TypeError('Wrong email')
    }

    let hashResult = await bcrypt.compare(body.password, instructor.hashedPassword)

    if (!hashResult) {
      return res.status(401).send({ error: 'invalid password' })
    }

    let newToken = await Token.generateAuthToken(['Instructor', 'Student'], 'Instructor', instructor._id)

    let updatedInstructor = await Instructor.findOneAndUpdate({ email: body.email }, { token: newToken })

    return res.header('x-auth', newToken.token).send(updatedInstructor)
  } catch (error) {
    ErrorMessage(error.message)
    return res.status(401).send({ error: error.message })
  }
}

let validateInstructor = (req, res) => {
  SuccessMessage('instructor validated')
  res.send(req.user)
}

module.exports = { createInstructor, loginInstructor, validateInstructor }
