var isProduction = true

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  require('dotenv').load()
  console.log('development')
  isProduction = false
}

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

require('./db/mongoose') // this starts the connection to the server

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API routes
app.get('/instructors', require('./routes/instructorsRoute').allInstructors)

// --- TEST ---
const { authenticateStudent, authenticateInstructor } = require('./middleware/authenticate')
const { Student } = require('./models/student')
const { Instructor } = require('./models/instructor')
const { Token } = require('./models/token')
const _ = require('lodash')

app.post('/student', (req, res) => {
  let body = _.pick(req.body, ['classcode', 'username'])

  let student = new Student({
    username: body.username,
    classcode: body.classcode
  })

  Token.generateAuthToken(['Student'], 'Student').then((token) => {
    student.token = token
    student.save((err) => {
      if (err) {
        res.json({ error: 'error' })
      } else {
        res.header('x-auth', token.token).send(student)
      }
    })
  }).catch((err) => {
    console.log(err)
    res.status(400).send('here')
  })
})

app.post('/instructor', (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])

  let instructor = new Instructor({
    email: body.email,
    hashedPassword: body.password
  })

  Token.generateAuthToken(['Instructor', 'Student'], 'Instructor').then((token) => {
    instructor.token = token
    instructor.save((err) => {
      if (err) {
        res.json({ error: 'error' })
      } else {
        res.header('x-auth', token.token).send(instructor)
      }
    })
  }).catch((err) => {
    console.log(err)
    res.status(400).send('here')
  })
})

app.post('/student/validate', authenticateStudent, (req, res) => {
  console.log('student validated')
  res.send(req.user)
})

app.post('/instructor/validate', authenticateInstructor, (req, res) => {
  console.log('instructor validated')
  res.send(req.user)
})
// --- END TEST ---

if (isProduction) {
  console.log('production')
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
  })
}

app.listen(port, () => console.log(`Listening on port ${port}`))
