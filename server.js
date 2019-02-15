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
const { authenticateStudent, authenticateInstructor } = require('./middleware/authenticate')
const instructorsRoute = require('./routes/instructorsRoute')
const studentsRoute = require('./routes/studentsRoute')

app.post('/instructor', instructorsRoute.createInstructor)
app.post('/instructor/testToken', authenticateInstructor, instructorsRoute.validateInstructor)

app.post('/student', studentsRoute.createStudent)
app.post('/student/testToken', authenticateStudent, studentsRoute.validateStudent)

if (isProduction) {
  console.log('production')
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
  })
}

app.listen(port, () => console.log(`Listening on port ${port}`))
