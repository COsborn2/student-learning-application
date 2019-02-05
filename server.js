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

app.post('/student', (req, res) => {
  // let body = _.pick(req.body, ['classcode', 'username'])

  var student = new Student({
    classcode: 'classcode',
    username: 'username'
  })

  Token.generateAuthToken(new Array('Student'), 'Student').then((token) => {
    student.token = token
    student.save()
    res.header('x-auth', student.token.token).send(student)
  }).catch((err) => {
    console.log(err)
  })
})

app.post('/student/validate', authenticateStudent, (req, res) => {
  console.log('student validated')
  res.send(req.user)
})

app.post('/instructor', (req, res) => {
  // let body = _.pick(req.body, ['classcode', 'username'])

  var instructor = new Instructor({
    email: 'sampleemail@gmail.com',
    hashedPassword: 'password!'
  })

  Token.generateAuthToken(['Instructor', 'Student'], 'Instructor').then((token) => {
    instructor.token = token
    instructor.save()
    res.header('x-auth', instructor.token.token).send(instructor)
  }).catch((err) => {
    console.log(err)
  })
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
