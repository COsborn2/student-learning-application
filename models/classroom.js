const mongoose = require('mongoose')

let ClassroomSchema = new mongoose.Schema({
  classcode: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor'
  }
})

let Classroom = mongoose.model('Classroom', ClassroomSchema)

module.exports = { Classroom }
