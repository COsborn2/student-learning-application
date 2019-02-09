const _ = require('lodash')
const { Token } = require('../models/token')
var { Instructor } = require('../models/instructor')

let allInstructors = (req, res) => {
  Instructor.find().then((instructors) => {
    res.send({ instructors })
  }, (e) => {
    res.status(400).send(e)
  })
}

let createInstructor = (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])

  let instructor = new Instructor({
    email: body.email,
    hashedPassword: body.password
  })

  Token.generateAuthToken(['Instructor', 'Student'], 'Instructor').then((token) => {
    instructor.token = token
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
    return res.status(400).send('here')
  })
}

let validateInstructor = (req, res) => {
  console.log('instructor validated')
  res.send(req.user)
}

module.exports = { allInstructors, createInstructor, validateInstructor }
