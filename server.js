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
const classroomsRoute = require('./routes/classroomsRoute')

app.post('/api/instructor', instructorsRoute.createInstructor)
app.get('/api/instructor', authenticateInstructor, instructorsRoute.getInstructor)
app.post('/api/instructor/login', instructorsRoute.loginInstructor)

app.post('/api/student', authenticateInstructor, studentsRoute.createStudent)
app.delete('/api/student', authenticateStudent, studentsRoute.deleteStudent) // TODO: instructor only
app.post('/api/student/login', studentsRoute.loginStudent)
app.get('/api/student/progress', authenticateStudent, studentsRoute.getAssignmentAndProgress)
app.put('/api/student/progress', authenticateStudent, studentsRoute.updateStudentProgress)

app.post('/api/classrooms', authenticateInstructor, classroomsRoute.createClassroom)

if (isProduction) {
  InfoMessage('Running in production mode')
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
  })
}

app.listen(port, () => SuccessMessage(`Listening on port ${port}`))
