const _ = require('lodash')
const { Instructor } = require('../models/instructor')
const { SuccessMessage, WarningMessage, ErrorMessage } = require('../middleware/message')
const { Assignment } = require('../models/assignment')
const { Classroom } = require('../models/classroom')
const { Word } = require('../models/word')

const { DefaultAssignments } = require('../AlphaEd/staticAssignments')

/* ClassroomsRoute requires Instructor JWT and classcode property
   It checks the database for the default assignments.
   If the default assignments do not exist the database is seeded with them. */
let createClassroom = async (req, res) => {
  let token = req.header('x-auth')

  let body = _.pick(req.body, ['classcode'])

  let instructorID = await Instructor.findByToken(token) // instructor classroom is attached to

  let instructor = await Instructor.findById(instructorID._id).populate('class')

  let assignmentIds = []

  // initialize assignments for the new course
  for (let index = 0; index < DefaultAssignments.length; index++) {
    let curId = await Assignment.findByLetter(DefaultAssignments[index].letters[0])

    if (!curId) { // expected default assignment could not be found. Attempt to repair
      try {
        curId = await seedDatabase(index)
        SuccessMessage(`Assignment "${curId}" successfully added`)
      } catch (err) {
        ErrorMessage(err.message)
        return res.status(500).send({ error: 'something went wrong when attempting to reseed database' })
      }
    }

    assignmentIds.push(curId)
  }

  let classroom = new Classroom({
    classcode: body.classcode,
    assignments: assignmentIds,
    instructor: instructor._id
  })

  // Create classroom
  try {
    await classroom.save()

    SuccessMessage(`Classroom created with ${classroom.assignments.length} assignments`)
  } catch (err) {
    if (err.code === 11000) {
      const message = 'User already exists with that email'
      ErrorMessage(message)
      return res.status(400).send({ error: message })
    }
    ErrorMessage(err.message)
    return res.status(400).send({ error: 'error' })
  }

  // Update instructor with new classId
  let updatedInstructor = await Instructor.findOneAndUpdate({
    email: instructor.email
  }, {
    $push: { class: classroom._id }
  }, {
    returnOriginal: false
  })

  SuccessMessage('Instructor successfully updated with new classroom')

  return res.send({ classroom, updatedInstructor })
}

// get all classes instructor is teaching
let getAllClasses = async (req, res) => {
  let token = req.header('x-auth')

  let instructor = await Instructor.findByToken(token)

  res.send(instructor)
}

// Given index of missing static assignment, try to insert into database
let seedDatabase = async (index) => {
  WarningMessage('Attempting to seed database with missing values')

  let currentAssignment = DefaultAssignments[index]

  let wordIds = []

  // determine if words exist in database. If not add them into database
  for (let index = 0; index < currentAssignment.words.length; index++) {
    let element = currentAssignment.words[index]
    let word = await Word.findOne({ text: element.text })

    if (!word) {
      word = new Word({
        text: element.text,
        picture: element.picture
      })

      try {
        await word.save()
      } catch (err) {
        ErrorMessage(err)
        ErrorMessage('Aborting attempting to reseed database')

        throw TypeError('Something went wrong')
      }
    }

    wordIds.push(word._id)
  }

  // make sure assignment doesn't exist in the database
  let newAssignment = new Assignment({
    name: currentAssignment.name,
    letters: currentAssignment.letters,
    words: wordIds
  })

  await newAssignment.save()
  return newAssignment._id
}

module.exports = { createClassroom, getAllClasses }
