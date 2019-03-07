const _ = require('lodash')
const { Token } = require('../models/token')
const { Student } = require('../models/student')
const { Classroom } = require('../models/classroom')
const { ErrorMessage, SuccessMessage } = require('../middleware/message')
const { ObjectID } = require('mongodb')

let createStudent = async (req, res) => {
  let body = _.pick(req.body, ['classcode', 'username'])

  let student = new Student({
    username: body.username,
    classcode: body.classcode
  })

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

  let token
  try {
    token = await Token.generateAuthToken(['Student'], 'Student', student._id)
    student.token = token
  } catch (err) {
    return res.status(400).send({ error: 'error' })
  }

  try {
    await student.save()
    SuccessMessage('Student created')
  } catch (err) {
    if (err.code === 11000) {
      ErrorMessage('User already exists with that username')
      return res.status(400).send({ error: 'User already exists with that username' })
    }
    ErrorMessage(err.message)
    return res.status(400).send({ error: 'error' })
  }

  await Classroom.findOneAndUpdate({
    classcode: classroom.classcode
  }, {
    $push: { students: student._id }
  })

  res.header('x-auth', token.token).send(student)
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

  let classroom = await Classroom.findById(student.class).populate('assignments')

  if (!classroom) {
    ErrorMessage('Classroom not found')
    return res.status(400).send({ error: 'Classroom not found' })
  }

  res.send({ classroom })
}

let updateStudentProgress = async (req, res) => {
  let token = req.header('x-auth')

  let body = _.pick(req.body, ['currentLetter', 'currentWord', 'currentAssignment'])

  // values passed in through body
  let newCurrentLetter = _.toInteger(body.currentLetter)
  let newCurrentWord = _.toInteger(body.currentWord)
  let newCurrentAssignment = _.toInteger(body.currentAssignment)

  if (!_.isInteger(newCurrentAssignment) || !_.isInteger(newCurrentWord) || !_.isInteger(newCurrentLetter)) {
    const errorMessage = 'currentLetter, currentWord, and currentAssignment must be specified'
    ErrorMessage(errorMessage)
    return res.status(400).send({ error: errorMessage })
  }

  let student = await Student.findByToken(token)

  // values from student in database
  let studentCurrentAssignment = student.currentAssignment
  let studentCurrentLetter = student.currentLetter
  let studentCurrentWord = student.currentWord

  let assignments = await student.getAssignments()
  let numberAssignments = assignments.length

  let numberOfLetters = assignments[studentCurrentAssignment].letters.length
  let numberOfWords = assignments[studentCurrentAssignment].words.length

  let finishedCourse = false

  // ensure that letters are not being skipped
  if (studentCurrentLetter + 1 > newCurrentLetter + 1) {
    const errorMessage = `Skipping detected: new currentLetter value of ${newCurrentLetter} is more than 1 greater than new currentLetter value of ${studentCurrentLetter}`
    ErrorMessage(errorMessage)
    return res.status(400).send({ error: errorMessage })
  }

  // ensure that words are not being skipped
  if (studentCurrentWord + 1 > newCurrentWord + 1) {
    const errorMessage = `Skipping detected: new currentWord value of ${newCurrentWord} is more than 1 greater than new currentLetter value of ${studentCurrentWord}`
    ErrorMessage(errorMessage)
    return res.status(400).send({ error: errorMessage })
  }

  // ensure assignment is not being skipped
  if (studentCurrentAssignment + 1 > newCurrentAssignment + 1) {
    const errorMessage = `Skipping detected: new currentAssignment value of ${newCurrentAssignment} is more than 1 greater than new currentLetter value of ${studentCurrentAssignment}`
    ErrorMessage(errorMessage)
    return res.status(400).send({ error: errorMessage })
  }

  // if student has completed all the letters and words in an assignment, reset letter and word indexes
  if ((newCurrentLetter + 1 > numberOfLetters) && (newCurrentWord + 1 > numberOfWords)) {
    newCurrentLetter = 0
    newCurrentWord = 0
    SuccessMessage('Student has completed assignment')
  }

  if (newCurrentAssignment >= numberAssignments) { // if currentAssignment incremented is higher than all assignments then return finshedCourse = true
    finishedCourse = true
    SuccessMessage('Student has completed all assignments in the course')
  }

  // update currentLetter, currentWord, currentAssignment and finishedCourse flag
  let updatedStudent = await Student.findOneAndUpdate({
    _id: new ObjectID(student._id)
  }, {
    $set: {
      currentLetter: newCurrentLetter,
      currentWord: newCurrentWord,
      currentAssignment: newCurrentAssignment,
      finishedCourse
    }
  }, {
    new: true
  })

  res.send({ updatedStudent })
}

// /api/students/id
let deleteStudent = async (req, res) => {
  let studentId = req.params.id

  let student = await Student.findById(studentId)

  // remove student from classroom
  await Classroom.findByIdAndUpdate(student.class, {
    $pull: { students: student._id }
  })

  // Remove student from DB
  await Student.findByIdAndDelete(student._id)

  res.send({ student })
}

module.exports = { createStudent, loginStudent, validateStudent, getAssignmentAndProgress, updateStudentProgress, deleteStudent }
