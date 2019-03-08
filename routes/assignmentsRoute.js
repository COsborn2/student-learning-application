const { Assignment } = require('../models/assignment')
const { WarningMessage, SuccessMessage } = require('../middleware/message')

// /api/assignment/id
let getAssignmentById = async (req, res) => {
  let assignmentId = req.params.id

  let assignment = await Assignment.findById(assignmentId).populate('words')

  if (!assignment) {
    const err = `Assignment with that id of (${assignmentId}) could not be found`
    WarningMessage(err)
    return res.status(404).send({ error: err })
  }

  SuccessMessage(`Assignment with id of ${assignmentId} was found`)
  res.send({ assignment })
}

module.exports = { getAssignmentById }
