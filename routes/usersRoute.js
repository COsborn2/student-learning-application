var { User } = require('../models/user')

module.exports.allUsers = (req, res) => {
  User.find().then((users) => {
    res.send({ users })
  }, (e) => {
    res.status(400).send(e)
  })
}
