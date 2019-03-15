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
const assignmentsRoute = require('./routes/assignmentsRoute')
const tesseractRoute = require('./routes/tesseract/tesseractRoute')

app.post('/api/instructor', instructorsRoute.createInstructor)
app.get('/api/instructor', authenticateInstructor, instructorsRoute.getInstructor)
app.post('/api/instructor/login', instructorsRoute.loginInstructor)

app.post('/api/student', studentsRoute.createStudent)
app.post('/api/student/writing', authenticateStudent, tesseractRoute.detectImageText)
app.delete('/api/student/:id', authenticateInstructor, studentsRoute.deleteStudent)
app.post('/api/student/login', studentsRoute.loginStudent)
app.put('/api/student/progress', authenticateStudent, studentsRoute.updateStudentProgress)
app.post('/api/student/progress', authenticateStudent, studentsRoute.devSetStudentProgress)
app.get('/api/student', authenticateStudent, studentsRoute.initalizeStudent)

app.get('/api/assignment/:id', assignmentsRoute.getAssignmentById)

app.post('/api/classrooms', authenticateInstructor, classroomsRoute.createClassroom)
app.get('/api/classrooms', authenticateStudent, classroomsRoute.getStudentClassroom)
app.get('/api/classrooms/:id', authenticateInstructor, classroomsRoute.getInstructorClass)
app.get('/api/classrooms/students/:id', authenticateInstructor, classroomsRoute.getClassroom)

if (isProduction) {
  InfoMessage('Running in production mode')
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
  })
}

app.listen(port, () => SuccessMessage(`Listening on port ${port}`))
