const _ = require('lodash')
const { Token } = require('../models/token')
const { Instructor } = require('../models/instructor')
const { SuccessMessage, ErrorMessage } = require('../middleware/message')
const bcrypt = require('bcrypt')

let createInstructor = async (req, res) => {
  let body = _.pick(req.body, ['email', 'password', 'name'])

  let instructor = new Instructor({
    email: body.email,
    hashedPassword: body.password,
    name: body.name
  })

  let token

  try {
    token = await Token.generateAuthToken(['Instructor', 'Student'], 'Instructor', instructor._id)

    instructor.token = token

    await instructor.hashPassword()
  } catch (error) {
    ErrorMessage(error.message)
    return res.status(400).send({ error: 'error' })
  }

  instructor.save((err) => {
    if (err) {
      if (err.code === 11000) {
        ErrorMessage('User already exists with that email')
        return res.status(400).send({ error: 'User already exists with that email' })
      }
      ErrorMessage(err.message)
      return res.status(400).send({ error: 'error' })
    }
    SuccessMessage('Instructor created')
    res.header('x-auth', token.token).send(instructor)
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

    SuccessMessage('Instructor logged in')
    return res.header('x-auth', newToken.token).send(updatedInstructor)
  } catch (error) {
    ErrorMessage(error.message)
    return res.status(401).send({ error: error.message })
  }
}

let getInstructor = async (req, res) => {
  let token = req.header('x-auth')

  let instructor = await Instructor.findByToken(token)

  res.send(instructor)
}

module.exports = { createInstructor, loginInstructor, getInstructor }
