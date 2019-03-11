const _ = require('lodash')
const { Token } = require('../models/token')
const { Student } = require('../models/student')
const { Assignment } = require('../models/assignment')
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

let updateStudentProgress = async (req, res) => {
  let token = req.header('x-auth')

  let body = _.pick(req.body, ['currentLetter', 'currentWord', 'currentAssignment'])

  // values passed in through body
  let newLetterIndex = _.toInteger(body.currentLetter)
  let newWordIndex = _.toInteger(body.currentWord)
  let newAssignmentIndex = _.toInteger(body.currentAssignment)

  if (!_.isInteger(newAssignmentIndex) || !_.isInteger(newWordIndex) || !_.isInteger(newLetterIndex)) {
    const errorMessage = 'currentLetter, currentWord, and currentAssignment must be specified'
    ErrorMessage(errorMessage)
    return res.status(400).send({ error: errorMessage })
  }

  let student = await Student.findByToken(token)

  // values from student in database
  const currentAssignmentIndex = student.currentAssignment
  const currentLetterIndex = student.currentLetter
  const currentWordIndex = student.currentWord
  let finishedCourse = false
  let errorMessage = null

  if (newAssignmentIndex < currentAssignmentIndex) {
    errorMessage = `Update Assignment Progress Error: The new assignment index ${newAssignmentIndex} cannot be less than the current assignment index ${currentAssignmentIndex}`
  } else if (newAssignmentIndex > currentAssignmentIndex) {
    if (newAssignmentIndex > currentAssignmentIndex + 1) {
      errorMessage = `Update Assignment Progress Error: The new assignment index ${newAssignmentIndex} cannot be greater than the current assignment index ${currentAssignmentIndex} plus one`
    } else {
      // valid assignment progression, reset letter and word index to beginning of assignment
      newLetterIndex = 0
      newWordIndex = 0
    }
  } else { // the current assignment didn't change
    if (newLetterIndex !== currentLetterIndex && newWordIndex !== currentWordIndex) {
      errorMessage = 'Update Assignment Progress Error: The new word index and the new letter index cannot be updated at the same time'
    } else {
      // only letter index or word index has been updated
      if (newWordIndex > currentWordIndex + 1) {
        errorMessage = `Update Word Progress Error: The new word index ${newWordIndex} cannot be greater than the current word index ${currentWordIndex} plus one`
      } else if (newLetterIndex > currentLetterIndex + 1) {
        errorMessage = `Update Letter Progress Error: The new letter index ${newLetterIndex} cannot be greater than the current letter index ${currentLetterIndex} plus one`
      }
    }
  }

  if (errorMessage) {
    // if an progress error was detected
    ErrorMessage(errorMessage)
    return res.status(400).send({ error: errorMessage })
  }

  let numberAssignments = await student.getAssignments().length

  if (newAssignmentIndex >= numberAssignments) {
    // all assignments in course are completed
    finishedCourse = true
    SuccessMessage('Student has completed all assignments in the course')
  }

  // update currentLetter, currentWord, currentAssignment and finishedCourse flag
  let updatedStudent = await Student.findOneAndUpdate({
    _id: new ObjectID(student._id)
  }, {
    $set: {
      currentLetter: newLetterIndex,
      currentWord: newWordIndex,
      currentAssignment: newAssignmentIndex,
      finishedCourse
    }
  }, {
    new: true
  })

  SuccessMessage(`Student progress successfully updated\n\tAssignment: ${newAssignmentIndex}\n\tLetter: ${newLetterIndex}\n\tWord: ${newWordIndex}`)
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

let initalizeStudent = async (req, res) => {
  let token = req.header('x-auth')

  let student = await Student.findByToken(token)

  let classroom = await Classroom.findById(student.class)

  let assignmentIds = await classroom.getLetters()

  let assignmentIndex = (student.finishedCourse)
    ? classroom.assignments.length - 1
    : student.currentAssignment // gets last assignment if user has completed the course

  let currentAssignment = await Assignment.findById(assignmentIds[assignmentIndex].assignmentId).populate('words')

  res.send({ assignmentIds, currentAssignment })
}

module.exports = {
  createStudent,
  loginStudent,
  validateStudent,
  updateStudentProgress,
  deleteStudent,
  initalizeStudent
}
