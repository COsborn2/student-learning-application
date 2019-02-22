const { InfoMessage, SuccessMessage } = require('./middleware/message')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

var isProduction = true

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  require('dotenv').load()
  InfoMessage('Running in Development mode')
  isProduction = false
}

require('./db/mongoose') // this starts the connection to the server

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API routes
const { authenticateStudent, authenticateInstructor } = require('./middleware/authenticate')
const instructorsRoute = require('./routes/instructorsRoute')
const studentsRoute = require('./routes/studentsRoute')
const wordsRoute = require('./routes/wordsRoute')

app.post('/api/instructor', instructorsRoute.createInstructor)
app.post('/api/instructor/login', instructorsRoute.loginInstructor)
app.post('/api/instructor/testToken', authenticateInstructor, instructorsRoute.validateInstructor)

app.post('/api/student', studentsRoute.createStudent)
app.post('/api/student/login', studentsRoute.loginStudent)
app.get('/api/student', authenticateStudent, studentsRoute.getAssignmentAndProgress)

app.post('/api/word', authenticateInstructor, wordsRoute.createWord)
app.put('/api/updateWord', authenticateInstructor, wordsRoute.updateWord)

if (isProduction) {
  InfoMessage('Running in production mode')
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
  })
}

app.listen(port, () => SuccessMessage(`Listening on port ${port}`))
