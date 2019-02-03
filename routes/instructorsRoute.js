var { Instructor } = require('../models/instructor')

module.exports.allInstructors = (req, res) => {
  Instructor.find().then((instructors) => {
    res.send({ instructors })
  }, (e) => {
    res.status(400).send(e)
  })
}
