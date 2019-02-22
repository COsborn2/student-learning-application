const _ = require('lodash')
const { Token } = require('../models/token')
const { Student } = require('../models/student')
const { ErrorMessage, SuccessMessage, WarningMessage } = require('../middleware/message')

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
          WarningMessage('User already exists with that username')
          return res.status(400).send({ error: 'User already exists with that username' })
        }
        ErrorMessage(err.message)
        return res.status(400).send({ error: 'error' })
      }
      res.header('x-auth', token.token).send(student)
    })
  }).catch((err) => {
    ErrorMessage(err)
    res.status(400).send({ error: 'error' })
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
  SuccessMessage('student validated')
  res.send(req.user)
}

// TODO: Given Token return Assignment and Progress
// let getAssignmentAndProgress = (req, res) => {
// }

// TODO: Set students first assignment upon student creation within classroom
// TODO: Fetch and update student to next assignment when previous assignment is completed
// let updateStudentProgress = (req, res) => {
// }

module.exports = { createStudent, loginStudent, validateStudent }
