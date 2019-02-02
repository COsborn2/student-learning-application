const mongoose = require('mongoose')

let ClassroomSchema = new mongoose.Schema({
  classcode: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  assignments: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  instructor: {
    type: mongoose.Schema.Types.ObjectId
  }
})

let Classroom = mongoose.model('Classroom', ClassroomSchema)

module.exports = { Classroom }
