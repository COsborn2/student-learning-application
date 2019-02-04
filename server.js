var isProduction = true

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  require('dotenv').load()
  console.log('development')
  isProduction = false
}

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
// temporarily unused
// const _ = require('lodash')

require('./db/mongoose') // this starts the connection to the server

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API routes
app.get('/instructors', require('./routes/instructorsRoute').allInstructors)

// --- TEST ---
const {authenticateStudent, authenticateInstructor} = require('./middleware/authenticate')
const {Student} = require('./models/student')

app.post('/student/validate', authenticateStudent, (req, res) => {
  console.log('valid and back here')

  console.log(req.token)
  console.log(req.user)

  res.send('valid')
})

app.post('/student', (req, res) => {
  var student = new Student({
    classcode: 'classcode',
    username: 'userName'
  })

  student.generateTokenAndSave(() => {
    res.header('x-auth', student.token.token).send()
  })
})

app.get('/student', (req, res) => {
  console.log('Getting all student data')
  Student.find().populate('token').exec((err, items) => {
    console.log('every student')
    console.log(JSON.stringify(items, undefined, 5))
    res.send(items)
  })
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
