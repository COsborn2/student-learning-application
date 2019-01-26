var { User } = require('../models/user')

module.exports.allUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.status(400).send(err)
    }
    res.send({ users })
  })
}
