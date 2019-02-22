const _ = require('lodash')
const { Token } = require('../models/token')
const { Student } = require('../models/student')
const { Assignment } = require('../models/assignment')
const { ErrorMessage, SuccessMessage, WarningMessage } = require('../middleware/message')

let createStudent = async (req, res) => {
  let body = _.pick(req.body, ['classcode', 'username'])

  let student = new Student({
    username: body.username,
    classcode: body.classcode
  })

  let token

  try {
    token = await Token.generateAuthToken(['Student'], 'Student', student._id)
    student.token = token
  } catch (error) {
    return res.status(400).send({ error: 'error' })
  }

  // attach student to classroom
  let classroom
  try {
    classroom = await student.getClass()

    if (!classroom) {
      throw TypeError('No classroom found with specified classcode')
    }

    student.class = classroom._id
  } catch (error) {
    ErrorMessage(error.message)
    return res.status(400).send({ error: error.message })
  }

  student.save((err) => { // save student into database
    if (err) {
      if (err.code === 11000) {
        WarningMessage('User already exists with that username')
        return res.status(400).send({ error: 'User already exists with that username' })
      }
      ErrorMessage(err.message)
      return res.status(400).send({ error: 'error' })
    }
    SuccessMessage('Student created')
    return res.header('x-auth', token.token).send(student)
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

    SuccessMessage('Student logged in')
    res.header('x-auth', newToken.token).send(updatedStudent)
  } catch (error) {
    ErrorMessage(error.message)
    res.status(401).send({ error: error.message })
  }
}

let validateStudent = (req, res) => {
  SuccessMessage('student validated')
  res.send(req.user)
}

let getAssignmentAndProgress = async (req, res) => {
  let token = req.header('x-auth')

  let student = await Student.findByToken(token)

  if (!student) {
    ErrorMessage('Student not found with specified _id')
    return res.status(400).send({ error: 'Student not found with specified _id' })
  }

  let classroom = await student.getClass()

  if (!classroom) {
    ErrorMessage('Classroom not found')
    return res.status(400).send({ error: 'Classroom not found' })
  }

  let assignmentId = classroom.assignments[student.currentAssignment]

  let currentAssignment = await Assignment.findById(assignmentId).populate('words')

  if (!currentAssignment) {
    ErrorMessage('Assignment not found')
    return res.status(400).send({ error: 'Assignment not found' })
  }

  res.send({ student, classroom, currentAssignment })
}

// TODO: Fetch and update student to next assignment when previous assignment is completed
// let updateStudentProgress = (req, res) => {
// }

module.exports = { createStudent, loginStudent, validateStudent, getAssignmentAndProgress }
