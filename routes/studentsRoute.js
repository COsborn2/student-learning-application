const _ = require('lodash')
const { Token } = require('../models/token')
const { Student } = require('../models/student')

let createStudent = (req, res) => {
  let body = _.pick(req.body, ['classcode', 'username'])

  let student = new Student({
    username: body.username,
    classcode: body.classcode
  })

  Token.generateAuthToken(['Student'], 'Student', student._id).then((token) => {
    student.token = token

    student.save((err) => {
      if (err) {
        if (err.code === 11000) {
          return res.status(400).send({ error: 'User already exists with that username' })
        }
        return res.status(400).send({ error: 'error' })
      }
      res.header('x-auth', token.token).send(student)
    })
  }).catch((err) => {
    console.log(err)
    res.status(400).send('here')
  })
}

let loginStudent = async (req, res) => {
  let body = _.pick(req.body, ['classcode', 'username'])

  try {
    let student = await Student.findOne({ classcode: body.classcode, username: body.username })

    if (!student) {
      throw TypeError('Wrong classcode or username')
    }

    let newToken = await Token.generateAuthToken(['Student'], 'Student', student._id)
    newToken._mid = student._id

    let updatedStudent = await Student.findOneAndUpdate({
      classcode: body.classcode,
      username: body.username
    }, {
      token: newToken
    })

    res.header('x-auth', newToken.token).send(updatedStudent)
  } catch (error) {
    res.status(401).send({ error: error.message })
  }
}

let validateStudent = (req, res) => {
  console.log('student validated')
  res.send(req.user)
}

module.exports = { createStudent, loginStudent, validateStudent }
