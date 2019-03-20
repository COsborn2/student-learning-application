const _ = require('lodash')
const { Instructor } = require('../models/instructor')
const { SuccessMessage, WarningMessage, ErrorMessage } = require('../middleware/message')
const { Assignment } = require('../models/assignment')
const { Classroom } = require('../models/classroom')
const { Word } = require('../models/word')
const { Student } = require('../models/student')
const { Token } = require('../models/token')

const { DefaultAssignments } = require('../AlphaEd/staticAssignments')

/**
 * @api {post} /api/classrooms Create Classroom
 * @apiVersion 0.9.0
 * @apiName CreateClassroom
 * @apiGroup Classroom
 *
 * @apiHeader {String} x-auth Json Web Token
 * @apiPermission Instructor
 *
 * @apiHeader {String} Content-Type application/json
 *
 * @apiParam (Request body) {String} classcode Desired classcode to add
 *
 * @apiSuccess {Object} result Classroom, Instructor objects
 * @apiSuccessExample Success-Response:
 *    {
 *      "classroom": {
 *        "assignments": [
 *          {
 *              "videos": [],
 *              "letters": [
 *                  "a",
 *                  "b",
 *                  "c"
 *              ],
 *              "words": [
 *                  "<id>"
 *              ],
 *              "_id": "<id>",
 *              "name": "Assignment 1",
 *              "__v": 0
 *          }
 *        ],
 *        "students": [],
 *        "_id": "<id>",
 *        "classcode": "someClasscode",
 *        "instructor": "<id>",
 *        "__v": 0
 *      },
 *      "updatedInstructor": {
 *        "name": "Cameron Osborn",
 *        "email": "<email>",
 *        "class": [
 *            "<id>"
 *        ]
 *      }
 *    }
 *
 * @apiError (400) ClassroomIdAlreadyExists A classroom with the chosen Id already exists
 *
 * @apiErrorExample Error-Response:
 *    {
 *      "error": "<error message>"
 *    }
 */
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
        ErrorMessage(err)
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
      const message = 'Classroom already exists with that classcode'
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
    new: true
  })

  SuccessMessage('Instructor successfully updated with new classroom')

  return res.send({ classroom, updatedInstructor })
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
        picture: (element.picture) ? element.picture : 'https://via.placeholder.com/200'
      })

      await word.save()
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

/**
 * @api {get} /api/classrooms Get Classroom - Student
 * @apiVersion 0.9.0
 * @apiName GetStudentClassroom
 * @apiGroup Classroom
 *
 * @apiHeader {String} x-auth Json Web Token
 * @apiPermission Student
 *
 * @apiSuccess {Object} classroom Classroom object
 * @apiSuccessExample Success-Response:
 *    {
 *      "classroom": {
 *        "assignments": [
 *            "<id>",
 *        ],
 *        "students": [
 *            "<id>"
 *        ],
 *        "_id": "<id>",
 *        "classcode": "courseCode",
 *        "instructor": "<id>",
 *        "__v": 0
 *      }
 *    }
 *
 * @apiError (404) IdNotFound Student not found with specified _id
 * @apiError (404) ClassroomNotFound Students classroom could not be found
 *
 * @apiErrorExample Error-Response:
 *    {
 *      "error": "<error message>"
 *    }
 */
let getStudentClassroom = async (req, res) => {
  let token = req.header('x-auth')

  let student = await Student.findByToken(token)

  if (!student) {
    ErrorMessage('Student not found with specified _id')
    return res.status(404).send({ error: 'Student not found with specified _id' })
  }

  let classroom = await Classroom.findById(student.class)

  if (!classroom) {
    ErrorMessage('Classroom not found')
    return res.status(404).send({ error: 'Classroom not found' })
  }

  res.send({ classroom })
}

/**
 * @api {get} /api/classrooms/:id Get Classroom - Instructor
 * @apiVersion 0.9.0
 * @apiName GetInstructorClassroom
 * @apiGroup Classroom
 *
 * @apiHeader {String} x-auth Json Web Token
 * @apiPermission Instructor
 *
 * @apiParam {Number} id Classroom ObjectId
 *
 * @apiSuccess {Object} classroom Classroom object
 * @apiSuccessExample Success-Response:
 *    {
 *      "classroom": {
 *        "assignments": [
 *          {
 *              "videos": [],
 *              "letters": [
 *                  "a",
 *                  "b",
 *                  "c"
 *              ],
 *              "words": [
 *                  "<id>"
 *              ],
 *              "_id": "<id>",
 *              "name": "Assignment 1",
 *              "__v": 0
 *          }
 *        ],
 *        "students": [],
 *        "_id": "<id>",
 *        "classcode": "someClasscode",
 *        "instructor": "<id>",
 *        "__v": 0
 *      },
 *      "updatedInstructor": {
 *        "name": "Cameron Osborn",
 *        "email": "<email>",
 *        "class": [
 *            "<id>"
 *        ]
 *      }
 *    }
 *
 * @apiError (404) ClassroomIdNotFound Classroom with that id could not be found
 * @apiError (401) InvalidInstructor Instructors token id does not match teacher of classroom
 *
 * @apiErrorExample Error-Response:
 *    {
 *      "error": "<error message>"
 *    }
 */
let getInstructorClass = async (req, res) => {
  let rawToken = req.header('x-auth')

  let classroomId = req.params.id

  let classroom = await Classroom.findById(classroomId)
    .populate('class')
    .populate('students')
    .populate('assignments')

  if (!classroom) {
    const err = `Classroom with id of (${classroomId}) could not be found`
    ErrorMessage(err)
    return res.status(404).send({ error: err })
  }

  let token = Token.convertRawToken(rawToken)

  // Make sure that class is actually one of the instructors classes
  let instructor = await Instructor.findById(token._mid)

  if (instructor.class.indexOf(classroomId) === -1) {
    const err = 'You are not the instructor for the requested classroom'
    ErrorMessage(err)
    return res.status(401).send({ error: err })
  }

  SuccessMessage(`Classroom with id of (${classroomId}) found`)
  res.send({ classroom })
}

module.exports = { createClassroom, getStudentClassroom, getInstructorClass }
