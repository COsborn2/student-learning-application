const _ = require('lodash')
const { Token } = require('../models/token')
const { Instructor } = require('../models/instructor')
const { SuccessMessage, ErrorMessage } = require('../middleware/message')
const bcrypt = require('bcrypt')

/**
 * @api {post} /instructor
 * @apiVersion 0.9.0
 * @apiName CreateInstructor
 * @apiGroup Instructor
 *
 * @apiPermisssion none
 *
 * @apiHeader {String} Content-Type application/json
 *
 * @apiParam (Request body) {String} email Instructors email
 * @apiParam (Request body) {String} password Instructors password
 * @apiParam (Request body) {String} name Instructors name. Can be first and last
 *
 * @apiSuccess {Object} instructor Instructor object of new instructor
 * @apiSuccessExample Success-Response:
 *    {
 *      "name": "Cameron Osborn",
 *      "email": "<email>",
 *      "class": []
 *    }
 *
 * @apiError (400) UserAlreadyExists A user already exists with that email
 *
 * @apiErrorExample Error-Response:
 *    {
 *      "error": "Classroom already exists with that classcode"
 *    }
 */
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
