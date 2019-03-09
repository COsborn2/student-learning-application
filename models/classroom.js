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

ClassroomSchema.methods.getLetters = async function () {
  let classroom = await Classroom.findById(this._id).populate('assignments')

  let assignmentLetters = []

  classroom.assignments.forEach(assignment => {
    let newIndex = { assignmentId: assignment._id, letters: assignment.letters }
    assignmentLetters.push(newIndex)
  })

  return assignmentLetters
}

let Classroom = mongoose.model('Classroom', ClassroomSchema)

module.exports = { Classroom }
