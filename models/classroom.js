const mongoose = require('mongoose')

let ClassroomSchema = new mongoose.Schema({
  classcode: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true
  }
})

let Classroom = mongoose.model('Classroom', ClassroomSchema)

module.exports = { Classroom }
