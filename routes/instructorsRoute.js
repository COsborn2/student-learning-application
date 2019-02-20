const _ = require('lodash')
const { Token } = require('../models/token')
const { Instructor } = require('../models/instructor')
const bcrypt = require('bcrypt')

let createInstructor = (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])
  console.log('body: ' + body)
  console.log('bodyEmail: ' + body.email)

  let instructor = new Instructor({
    email: body.email,
    hashedPassword: body.password
  })

  console.log('instructor: ' + instructor)
  console.log('email: ' + instructor.email)
  console.log('pass: ' + instructor.hashedPassword)

  Token.generateAuthToken(['Instructor', 'Student'], 'Instructor').then(async (token) => {
    instructor.token = token

    await instructor.hashPassword()

    instructor.save((err) => {
      if (err) {
        if (err.code === 11000) {
          return res.status(400).send({ error: 'User already exists with that email' })
        }
        return res.status(400).send({ error: 'error' })
      }
      res.header('x-auth', token.token).send(instructor)
    })
  }).catch((err) => {
    console.log(err)
    return res.status(400).send(err)
  })
}

let loginInstructor = async (req, res) => { // need to find instructor from email
  let body = _.pick(req.body, ['email', 'password'])

  console.log('body: ' + body)
  console.log('bodyEmail: ' + body.email)

  let instructor = await Instructor.findOne({ email: body.email })

  console.log('instructor: ' + instructor)
  console.log('instructorEmail: ' + instructor.email)

  console.log('email: ' + instructor.email)
  console.log('pass: ' + instructor.hashedPassword)

  let hashResult = await bcrypt.compare(body.password, instructor.hashedPassword)

  if (!hashResult) {
    return res.status(401).send({ error: 'invalid password' })
  }

  let newToken = await Token.generateAuthToken(['Instructor', 'Student'], 'Instructor')

  let updatedInstructor = await Instructor.findOneAndUpdate({ email: body.email }, { token: newToken })

  return res.header('x-auth', newToken.token).send(updatedInstructor)
}

let validateInstructor = (req, res) => {
  console.log('instructor validated')
  res.send(req.user)
}

module.exports = { createInstructor, loginInstructor, validateInstructor }
